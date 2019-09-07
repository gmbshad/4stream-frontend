import React from 'react';
import classNames from 'classnames';
import {sprintf} from 'sprintf-js';

import ModalDialog from './ModalDialog';
import {localizeString} from '../../localization/LocalizationUtils';
import {DONATION_TYPE} from '../../utils/Constants';
import Constants from '../../utils/Constants';
import {calculateAmountWithFee} from '../../utils/FeeCalculator';

const YANDEX_PAYMENT_TYPE = {
  YANDEX_WALLET: 'PC',
  CARD: 'AC',
  MOBILE: 'MC'
};

const PAYMENT_CATEGORY_TYPE = {
  DIRECT: 'DIRECT',
  E_WALLET: 'E_WALLET',
  CARD: 'CARD',
  MOBILE: 'MOBILE'
};

const PAYMENT_CATEGORY_POSITION = {
  FIRST: 'FIRST',
  LAST: 'LAST'
};

const MC_MIN_AMOUNT = 10.0;

export default class ModalDialogPaymentMethod extends ModalDialog {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      activePaymentCategory: PAYMENT_CATEGORY_TYPE.DIRECT,
      activePaymentMethod: null
    });
  }

  getContentClassNames() {
    return classNames('b-modal-dialog__content--payment-method', super.getContentClassNames());
  }

  getParentClassNames() {
    return classNames('b-modal-dialog--payment', super.getParentClassNames());
  }

  getControls() {
    const {activePaymentMethod} = this.state;
    const currentMethodAvailable = (activePaymentMethod !== null && activePaymentMethod.available);
    const modalControls = [
      {
        key: 'confirm',
        label: localizeString('MODAL_DIALOG.CONTROLS.CONFIRM'),
        preventClose: true,
        disabledCondition: () => !currentMethodAvailable,
        action: () => {
          if (currentMethodAvailable) {
            activePaymentMethod.callback(activePaymentMethod.paymentMethodName);
          }
        }
      }
    ];
    return modalControls;
  }


  renderPaymentCategory(label, value, position) {
    const categoryClasses = classNames({
      'b-modal-dialog-payment-category': true,
      'b-modal-dialog-payment-category--first': position === PAYMENT_CATEGORY_POSITION.FIRST,
      'b-modal-dialog-payment-category--last': position === PAYMENT_CATEGORY_POSITION.LAST,
      'b-modal-dialog-payment-category--active': this.state.activePaymentCategory === value
    });
    const clickHandler = () => {
      if (this.state.activePaymentCategory !== value) {
        this.setState({
          activePaymentCategory: value,
          activePaymentMethod: null
        });
      }
    };
    return (
        <div className={categoryClasses} onClick={clickHandler}>
          {label}
        </div>
    );
  }

  renderPaymentCategories() {
    const directLabel = localizeString('PAYMENT_DIALOG.CATEGORIES.DIRECT');
    const walletLabel = localizeString('PAYMENT_DIALOG.CATEGORIES.E_WALLET');
    const cardLabel = localizeString('PAYMENT_DIALOG.CATEGORIES.CARD');
    const mobileLabel = localizeString('PAYMENT_DIALOG.CATEGORIES.MOBILE');
    return (
        <div className="b-modal-dialog-payment-categories">
          {this.renderPaymentCategory(directLabel, PAYMENT_CATEGORY_TYPE.DIRECT, PAYMENT_CATEGORY_POSITION.FIRST)}
          {this.renderPaymentCategory(walletLabel, PAYMENT_CATEGORY_TYPE.E_WALLET, PAYMENT_CATEGORY_POSITION.MIDDLE)}
          {this.renderPaymentCategory(cardLabel, PAYMENT_CATEGORY_TYPE.CARD, PAYMENT_CATEGORY_POSITION.MIDDLE)}
          {this.renderPaymentCategory(mobileLabel, PAYMENT_CATEGORY_TYPE.MOBILE, PAYMENT_CATEGORY_POSITION.LAST)}
        </div>
    );
  }

  renderPaymentMethod({paymentMethodName, callback, available, paymentImageName}) {
    const {activePaymentMethod} = this.state;
    const paymentMethodClassNames = classNames({
      'b-modal-dialog-payment-method': true,
      'b-modal-dialog-payment-method--active':
          (activePaymentMethod !== null && activePaymentMethod.paymentMethodName === paymentMethodName)
    });

    let imageUrl = '/resources/images/' + paymentImageName;
    if (!available) {
      imageUrl += '_grey';
    }
    imageUrl += '.png';
    const paymentMethod = {paymentMethodName, callback, available, paymentImageName};
    const setPaymentMethod = () => {
      this.setState({activePaymentMethod: paymentMethod});
    };
    return (
        <div className="b-modal-dialog-payment-methods-row__item" key={paymentMethodName}>
          <div className={paymentMethodClassNames} onClick={setPaymentMethod}>
            <img className="b-modal-dialog-payment-method__image" src={imageUrl}/>
          </div>
        </div>
    );
  }

  renderPaymentMethodsRow(paymentMethods) {
    const renderedPaymentMethods = paymentMethods.map((method) => this.renderPaymentMethod(method));
    return (
      <div className="b-modal-dialog-payment-methods__row">
        <div className="b-modal-dialog-payment-methods-row">
          {renderedPaymentMethods}
        </div>
      </div>
    );
  }

  renderPaymentMethodCategoryDescription(paymentCategory) {
    let description = '';
    if (paymentCategory === PAYMENT_CATEGORY_TYPE.DIRECT) {
      description = localizeString('PAYMENT_DIALOG.CATEGORIES.DIRECT_DESC');
    } else if (paymentCategory === PAYMENT_CATEGORY_TYPE.E_WALLET) {
      description = localizeString('PAYMENT_DIALOG.CATEGORIES.E_WALLET_DESC');
    } else if (paymentCategory === PAYMENT_CATEGORY_TYPE.CARD) {
      description = localizeString('PAYMENT_DIALOG.CATEGORIES.CARD_DESC');
    } else if (paymentCategory === PAYMENT_CATEGORY_TYPE.MOBILE) {
      description = localizeString('PAYMENT_DIALOG.CATEGORIES.MOBILE_DESC');
    }
    return (
        <div className="b-modal-dialog-payment-methods__desc">
          <div className="b-modal-dialog-payment-methods-desc">
            {description}
          </div>
        </div>
    );
  }

  renderPaymentMethodUnavailableReason() {
    const {activePaymentMethod} = this.state;
    const {amount} = this.props;
    if (activePaymentMethod === null || activePaymentMethod.available) {
      return null;
    }
    let reason = localizeString('PAYMENT_DIALOG.UNSUPPORTED_PAYMENT_TYPE');
    const methodName = activePaymentMethod.paymentMethodName;
    const minAmountRestricted = (methodName === DONATION_TYPE.UNITPAY_MC_MTS || methodName === DONATION_TYPE.UNITPAY_MC_MEGAFON ||
        methodName === DONATION_TYPE.UNITPAY_MC_BEELINE || methodName === DONATION_TYPE.UNITPAY_MC_TELE2);
    if (minAmountRestricted && amount < MC_MIN_AMOUNT) {
      reason = sprintf(localizeString('PAYMENT_DIALOG.MC_MIN_AMOUNT'), MC_MIN_AMOUNT, Constants.RUBLE);
    }
    return (
        <div className="b-modal-dialog-payment-methods__unavailable-reason">
          <div className="b-modal-dialog-payment-methods-unavailable-reason">
            {reason}
          </div>
        </div>
    );
  }

  renderPaymentMethodFeeEstimate() {
    const {activePaymentMethod} = this.state;
    let estimate = '';
    if (activePaymentMethod !== null) {
      let {amount} = this.props;
      amount = amount.toFixed(2);
      const amountWithFee = calculateAmountWithFee(activePaymentMethod.paymentMethodName, amount).toFixed(2);
      estimate = sprintf(localizeString('PAYMENT_DIALOG.FEE_ESTIMATION'),
          amount, Constants.RUBLE, amountWithFee, Constants.RUBLE);
    }

    return (
        <div className="b-modal-dialog-payment-wrapper__fee-estimate">
          <div className="b-modal-dialog-payment-fee-estimate">
            {estimate}
          </div>
        </div>
    );
  }

  renderPaymentMethods() {
    const {activePaymentCategory} = this.state;
    const {webmoney, unitPay, yandex} = this.props.paymentMethods;
    const {amount} = this.props;
    const mcUnitPayAvailable = unitPay && amount >= MC_MIN_AMOUNT;

    const yandexWalletCallback = this.props.yandexCallback.bind(this, YANDEX_PAYMENT_TYPE.YANDEX_WALLET);
    const yandexCardCallback = this.props.yandexCallback.bind(this, YANDEX_PAYMENT_TYPE.CARD);

    let paymentMethodsRow1 = null;
    if (activePaymentCategory === PAYMENT_CATEGORY_TYPE.DIRECT) {
      paymentMethodsRow1 = [
        {
          paymentMethodName: DONATION_TYPE.WEBMONEY,
          callback: this.props.webmoneyCallback,
          available: webmoney,
          paymentImageName: 'wm'
        },
        {
          paymentMethodName: DONATION_TYPE.YANDEX_WALLET,
          callback: yandexWalletCallback,
          available: yandex,
          paymentImageName: 'yandex'
        },
        {
          paymentMethodName: DONATION_TYPE.YANDEX_CREDIT_CARD,
          callback: yandexCardCallback,
          available: yandex,
          paymentImageName: 'card'
        }
      ];
    } else if (activePaymentCategory === PAYMENT_CATEGORY_TYPE.E_WALLET) {
      paymentMethodsRow1 = [
        {
          paymentMethodName: DONATION_TYPE.UNITPAY_WEBMONEY,
          callback: this.props.unitPayCallback,
          available: unitPay,
          paymentImageName: 'wm'
        },
        {
          paymentMethodName: DONATION_TYPE.UNITPAY_QIWI,
          callback: this.props.unitPayCallback,
          available: unitPay,
          paymentImageName: 'qiwi'
        },
        {
          paymentMethodName: DONATION_TYPE.UNITPAY_YANDEX,
          callback: this.props.unitPayCallback,
          available: unitPay,
          paymentImageName: 'yandex'
        }
      ];
    } else if (activePaymentCategory === PAYMENT_CATEGORY_TYPE.CARD) {
      paymentMethodsRow1 = [
        {
          paymentMethodName: DONATION_TYPE.UNITPAY_CARD,
          callback: this.props.unitPayCallback,
          available: unitPay,
          paymentImageName: 'card'
        },
        {
          paymentMethodName: DONATION_TYPE.UNITPAY_ALFACLICK,
          callback: this.props.unitPayCallback,
          available: unitPay,
          paymentImageName: 'alfaClick'
        }
      ];
    } else if (activePaymentCategory === PAYMENT_CATEGORY_TYPE.MOBILE) {
      paymentMethodsRow1 = [
        {
          paymentMethodName: DONATION_TYPE.UNITPAY_MC_MTS,
          callback: this.props.unitPayCallback,
          available: mcUnitPayAvailable,
          paymentImageName: 'mts'
        },
        {
          paymentMethodName: DONATION_TYPE.UNITPAY_MC_MEGAFON,
          callback: this.props.unitPayCallback,
          available: mcUnitPayAvailable,
          paymentImageName: 'megafon'
        },
        {
          paymentMethodName: DONATION_TYPE.UNITPAY_MC_BEELINE,
          callback: this.props.unitPayCallback,
          available: mcUnitPayAvailable,
          paymentImageName: 'beeline'
        },
        {
          paymentMethodName: DONATION_TYPE.UNITPAY_MC_TELE2,
          callback: this.props.unitPayCallback,
          available: mcUnitPayAvailable,
          paymentImageName: 'tele2'
        }
      ];
    }

    return (
        <div className="b-modal-dialog-payment-methods">
          {this.renderPaymentMethodCategoryDescription(activePaymentCategory)}
          {this.renderPaymentMethodsRow(paymentMethodsRow1)}
          {this.renderPaymentMethodUnavailableReason()}
        </div>
    );
  }

  renderContent() {
    return (
        <div className="b-modal-dialog-payment-wrapper">
          <hr className="b-modal-dialog-payment-content-separator"/>
          <div className="b-modal-dialog-payment">
            <div className="b-modal-dialog-payment__categories">
              {this.renderPaymentCategories()}
            </div>
            {this.renderPaymentMethods()}
          </div>
          <hr className="b-modal-dialog-payment-content-separator"/>
          {this.renderPaymentMethodFeeEstimate()}
        </div>
    );
  }
}

ModalDialogPaymentMethod.propTypes = Object.assign({}, ModalDialog.propTypes, {
  amount: React.PropTypes.number.isRequired,
  paymentMethods: React.PropTypes.shape({
    webmoney: React.PropTypes.bool.isRequired,
    yandex: React.PropTypes.bool.isRequired,
    unitPay: React.PropTypes.bool.isRequired
  }).isRequired,
  webmoneyCallback: React.PropTypes.func.isRequired,
  yandexCallback: React.PropTypes.func.isRequired,
  unitPayCallback: React.PropTypes.func.isRequired
});
