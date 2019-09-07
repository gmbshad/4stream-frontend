import React from 'react';
import {sprintf} from 'sprintf-js';
import alt from '../alt';
import ActionListeners from 'alt-utils/lib/ActionListeners';
import classNames from 'classnames';

import Button from '../components/Button';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Tooltip from '../components/Tooltip';
import DonationsActions from '../actions/DonationsActions';
import SoundActions from '../actions/SoundActions';
import AuthActions from '../actions/AuthActions';
import AuthStore from '../stores/AuthStore';
import SoundStore from '../stores/SoundStore';
import ModalDialogActions from '../actions/ModalDialogActions';
import Constants from '../utils/Constants';
import {DONATION_TYPE, DONATION_SIGNATURE, TTS_VOICE} from '../utils/Constants';
import {getCookie} from '../utils/CookieManager';
import ModalDialogPaymentMethod from '../components/modal/ModalDialogPaymentMethod';
import {getDonationFormAmountValidation, getMockValidation} from '../utils/Validations';
import Validator from '../utils/Validator';
import {localizeString} from '../localization/LocalizationUtils';
import {saveCookie} from '../utils/CookieManager';

const WEBMONEY_PENDING_DONATION_ID = 'SA_PENDING_DONATION_ID';

const PREVIEW_TTS_LINK_COOLDOWN_SECONDS = 3;

export default class DonationForm extends React.Component {

  constructor(props) {
    super(props);
    this.sendDonation = this.sendDonation.bind(this);
    this.updateSender = this.updateSender.bind(this);
    this.updateSum = this.updateSum.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.payViaWebmoney = this.payViaWebmoney.bind(this);
    this.payViaYandex = this.payViaYandex.bind(this);
    this.payViaUnitPay = this.payViaUnitPay.bind(this);
    this.validateAndSave = this.validateAndSave.bind(this);
    this.trySignDonationIfNotManual = this.trySignDonationIfNotManual.bind(this);
    this.switchDonationSignatureState = this.switchDonationSignatureState.bind(this);
  }

  componentWillMount() {
    this.setState(this.getInitialComponentState());
    this.setState({
      loginInfo: {
        userId: AuthStore.getState().userId,
        userName: AuthStore.getState().userName
      }
    }, this.trySignDonationIfNotManual);

    this.actionListener = new ActionListeners(alt);
    this.actionListener.addActionListener(
        AuthActions.receiveLoginInfo.id, (loginInfo) => {
          this.setState({
            loginInfo: {
              userId: loginInfo.userId,
              userName: loginInfo.userName
            }
          }, this.trySignDonationIfNotManual);
        });
    this.setState({
      isSoundPlaying: SoundStore.getState().isSoundPlaying
    });
    this.actionListener.addActionListener(
        SoundActions.soundStateChanged.id, (isPlaying) => {
          this.setState({
            isSoundPlaying: isPlaying
          });
        });
  }

  componentDidMount() {
    const validationCallback = (formValid) => this.setState({formValid});
    this.validator = new Validator(validationCallback, [this.refs.sender, this.refs.sum]);
    this.validator.validate();
  }

  componentWillUnmount() {
    this.actionListener.removeAllActionListeners();
  }

  getInitialComponentState() {
    const donationState = {
      sender: '',
      sum: '',
      message: '',
      signature: DONATION_SIGNATURE.NONE,
      formValid: false,
      ttsPreviewCooldown: false,
      loginInfo: {
        userId: undefined,
        userName: undefined
      }
    };
    try {
      const donation = getCookie(Constants.COOKIE_SAVED_DONATION);
      if (donation !== undefined) {
        donationState.sender = donation.sender;
        if (donation.recipientId === this.props.recipientId) {
          donationState.sum = donation.sum;
          donationState.message = donation.message;
        }
      }
    } catch (error) {
      // cookie is corrupted, proceeding with default values
      console.error(error);
    }
    return donationState;
  }

  trySignDonationIfNotManual() {
    const {loginInfo} = this.state;
    if (!this.props.manual && loginInfo.userId !== undefined && loginInfo.userId !== null) {
      this.setState({
        sender: loginInfo.userName,
        signature: DONATION_SIGNATURE.TWITCH
      });
    }
  }

  switchDonationSignatureState() {
    const signature = this.state.signature;
    if (signature === DONATION_SIGNATURE.TWITCH) {
      this.setState({
        signature: DONATION_SIGNATURE.NONE
      });
    } else {
      const {loginInfo} = this.state;
      if (loginInfo.userId === null) {
        DonationsActions.authorizeDonationSender();
      } else {
        this.setState({
          signature: DONATION_SIGNATURE.TWITCH,
          sender: loginInfo.userName
        });
      }
    }
  }

  getDonationView() {
    return ({
      recipientId: this.props.recipientId,
      sender: this.state.sender,
      sum: this.state.sum,
      message: this.state.message,
      signature: this.state.signature
    });
  }

  getSumValidation() {
    const {donationLimits} = this.props;
    const minAmount = (donationLimits !== undefined) ? donationLimits.minDonationAmount 
        : Constants.DEFAULT_MIN_DONATION_AMOUNT;
    return getDonationFormAmountValidation(minAmount, Constants.MAX_DONATION_AMOUNT);
  }

  sendDonation() {
    if (this.props.onButtonClick) {
      this.props.onButtonClick();
    }
    if (!this.props.manual) {
      this.processPaymentDonation();
    } else {
      this.processManualDonation();
    }
  }

  validateAndSave() {
    const valid = this.validator.validate();
    if (valid) {
      const donation = {
        recipientId: this.props.recipientId,
        sender: this.state.sender,
        sum: this.state.sum,
        message: this.state.message
      };
      const donationString = JSON.stringify(donation);
      saveCookie(Constants.COOKIE_SAVED_DONATION, donationString);
    }
  }

  updateSender(value) {
    this.setState({
      sender: value
    }, this.validateAndSave);
  }

  updateSum(value) {
    this.setState({
      sum: value
    }, this.validateAndSave);
  }

  updateMessage(event) {
    const message = event.target.value;
    this.setState({
      message: message
    }, this.validateAndSave);
  }
  
  processPaymentDonation() {
    const {paymentMethods} = this.props;
    const modal = (
        <ModalDialogPaymentMethod title={localizeString('PAYMENT_DIALOG.TITLE')}
                                  amount={parseFloat(this.state.sum)}
                                  paymentMethods={paymentMethods}
                                  webmoneyCallback={this.payViaWebmoney}
                                  yandexCallback={this.payViaYandex}
                                  unitPayCallback={this.payViaUnitPay}/>
    );
    ModalDialogActions.showModal(modal);
  }

  getPaymentDescription() {
    return sprintf(Constants.PAYMENT_DESCRIPTION, this.props.recipientName);
  }

  payViaWebmoney() {
    this.refs.webmoneyDescription.value = this.getPaymentDescription();
    this.refs.webmoneyAmount.value = this.getDonationView().sum;
    DonationsActions.requestAddPaymentDonation({
      donationView: this.getDonationView(),
      sendDonationForm: this.refs.webmoneyForm,
      donationIdInput: this.refs.webmoneyDonationId
    });
  }

  adjustYandexPaymentAmount(amount) {
    if (parseFloat(amount) < Constants.MIN_YANDEX_MONEY_AMOUNT) {
      return Constants.MIN_YANDEX_MONEY_AMOUNT;
    }
    return amount;
  }

  payViaYandex(paymentType) {
    this.refs.yandexPaymentType.value = paymentType;
    this.refs.yandexAmount.value = this.adjustYandexPaymentAmount(this.getDonationView().sum);
    this.refs.yandexFormComment.value = this.getPaymentDescription();
    this.refs.yandexShortDescription.value = this.getPaymentDescription();
    this.refs.yandexTargets.value = this.getPaymentDescription();
    DonationsActions.requestAddPaymentDonation({
      donationView: this.getDonationView(),
      sendDonationForm: this.refs.yandexForm,
      donationIdInput: this.refs.yandexDonationId
    });
  }

  adjustUnitPayForm(paymentType) {
    if (paymentType === DONATION_TYPE.UNITPAY_WEBMONEY) {
      this.refs.unitPayForm.action = this.refs.unitPayForm.action + '/webmoney';
      this.refs.unitPayHideOtherPSMethods.value = true;
    } else if (paymentType === DONATION_TYPE.UNITPAY_QIWI) {
      this.refs.unitPayForm.action = this.refs.unitPayForm.action + '/qiwi';
      this.refs.unitPayHideOtherMethods.value = true;
    } else if (paymentType === DONATION_TYPE.UNITPAY_YANDEX) {
      this.refs.unitPayForm.action = this.refs.unitPayForm.action + '/yandex';
      this.refs.unitPayHideOtherMethods.value = true;
    } else if (paymentType === DONATION_TYPE.UNITPAY_CARD) {
      this.refs.unitPayForm.action = this.refs.unitPayForm.action + '/card';
      this.refs.unitPayHideOtherPSMethods.value = true;
    } else if (paymentType === DONATION_TYPE.UNITPAY_ALFACLICK) {
      this.refs.unitPayForm.action = this.refs.unitPayForm.action + '/alfaClick';
      this.refs.unitPayHideOtherMethods.value = true;
    } else if (paymentType === DONATION_TYPE.UNITPAY_MC_MTS) {
      this.refs.unitPayForm.action = this.refs.unitPayForm.action + '/mc';
      this.refs.unitPayOperator.value = 'mts';
      this.refs.unitPayHideOtherMethods.value = true;
    } else if (paymentType === DONATION_TYPE.UNITPAY_MC_MEGAFON) {
      this.refs.unitPayForm.action = this.refs.unitPayForm.action + '/mc';
      this.refs.unitPayOperator.value = 'mf';
      this.refs.unitPayHideOtherMethods.value = true;
    } else if (paymentType === DONATION_TYPE.UNITPAY_MC_BEELINE) {
      this.refs.unitPayForm.action = this.refs.unitPayForm.action + '/mc';
      this.refs.unitPayOperator.value = 'beeline';
      this.refs.unitPayHideOtherMethods.value = true;
    } else if (paymentType === DONATION_TYPE.UNITPAY_MC_TELE2) {
      this.refs.unitPayForm.action = this.refs.unitPayForm.action + '/mc';
      this.refs.unitPayOperator.value = 'tele2';
      this.refs.unitPayHideOtherMethods.value = true;
    }
  }

  payViaUnitPay(paymentType) {
    this.refs.unitPayAmount.value = this.getDonationView().sum;
    this.refs.unitPayDescription.value = this.getPaymentDescription();
    this.adjustUnitPayForm(paymentType);
    DonationsActions.requestAddPaymentDonation({
      donationView: this.getDonationView(),
      sendDonationForm: this.refs.unitPayForm,
      donationIdInput: this.refs.unitPayDonationId
    });
  }

  processManualDonation() {
    DonationsActions.requestAddManualDonation(this.getDonationView());
  }

  renderCancelButton() {
    const onClick = (this.props.onButtonClick) ? this.props.onButtonClick : () => {};
    return (
      <div className="b-donation-form-controls__item">
        <Button text={localizeString('MODAL_DIALOG.CONTROLS.CANCEL')} onClick={onClick} wide/>
      </div>
    );
  }

  getDonationLimitsDescription() {
    if (this.props.donationLimits === undefined) {
      return undefined;
    }
    const {speechEnabled, minDonationAmount, minAmountForSynthesis} = this.props.donationLimits;
    const ttsStatus = speechEnabled
        ? sprintf(localizeString('DONATION_FORM.TTS_ENABLED'), minAmountForSynthesis, Constants.RUBLE)
        : localizeString('DONATION_FORM.TTS_DISABLED');
    const minAmountText =
        sprintf(localizeString('DONATION_FORM.MIN_DONATION_AMOUNT'), minDonationAmount, Constants.RUBLE);
    return sprintf('%s %s', minAmountText, ttsStatus);
  }

  renderSpeechPreview() {
    if (this.props.ttsPreview !== true) {
      return null;
    }
    const {message, ttsPreviewCooldown, isSoundPlaying} = this.state;
    const {ttsVoice} = this.props.donationLimits;
    const previewDisabled = ((message === '' || ttsPreviewCooldown) && !isSoundPlaying);
    const playMessage = () => {
      if (!previewDisabled) {
        this.setState({
          ttsPreviewCooldown: true
        });
        setTimeout(() => {
          this.setState({
            ttsPreviewCooldown: false
          });
        }, PREVIEW_TTS_LINK_COOLDOWN_SECONDS * 1000);
        SoundActions.previewTTS({text: message, ttsVoice});
      }
    };
    const stopSound = () => SoundActions.stopSound();
    const currentAction = !isSoundPlaying ? playMessage : stopSound;
    const previewClassNames = classNames({
      'b-donation-form-speech-preview': true,
      'b-donation-form-speech-preview--disabled': previewDisabled
    });

    const spinAnimation = (message !== '' && ttsPreviewCooldown);
    const iconClasses = classNames({
      'b-donation-form-speech-preview__icon fa': true,
      'fa-stop-circle': isSoundPlaying,
      'fa-volume-up': !spinAnimation && !isSoundPlaying,
      'fa-spinner fa-pulse': spinAnimation && !isSoundPlaying
    });
    const previewLabelId = !isSoundPlaying ? 'DONATION_FORM.TTS_PREVIEW' : 'DONATION_FORM.TTS_PREVIEW_STOP';
    const previewLabel = localizeString(previewLabelId);
    return (
        <div className="b-donation-form__input b-donation-form__input--speech-preview">
          <div className={previewClassNames} onClick={currentAction}>
            <div className={iconClasses}>
            </div>
            <div className="b-donation-from-speech-preview__anchor">
              {previewLabel}
            </div>
          </div>
        </div>
    );
  }

  renderManualDonationRemark() {
    if (this.props.manual !== true) {
      return null;
    }
    return (
        <div className="b-donation-form__manual-remark">
          <div className="b-donation-form-manual-remark">
            {localizeString('DONATION_FORM.MANUAL_DONATION_REMARK')}
          </div>
        </div>
    );
  }

  renderVisibleForm() {
    const cancelButton = this.props.withCancel ? this.renderCancelButton() : null;
    const donationLimitsDescription = this.getDonationLimitsDescription();
    const messageRemark = (!this.props.manual && this.props.recipientName !== Constants.STREAM_ASSIST_TWITCH_LOGIN &&
        this.props.stressSupport) ? localizeString('DONATION_FORM.MESSAGE_REMARK') : undefined;
    const readOnlySender = this.state.signature !== DONATION_SIGNATURE.NONE;
    const signDonationButtonText = (this.state.signature === DONATION_SIGNATURE.NONE)
      ? localizeString('DONATION_FORM.SIGN_CONFIRM') : localizeString('DONATION_FORM.SIGN_CANCEL');
    const signDonation = (!this.props.manual) ? (
        <div className="b-donation-form__input">
          <div className="b-donation-form-sign">
            <div className="b-donation-form-sign__button">
              <Button text={signDonationButtonText} onClick={this.switchDonationSignatureState} wider
                      fontAwesomeClass="fa-twitch" disabled={this.state.loginInfo.userId === undefined}/>
            </div>
            <div className="b-donation-form-sign__tooltip">
              <Tooltip id="sign" text={localizeString('DONATION_FORM.SIGN_TOOLTIP')}/>
            </div>
          </div>
        </div>
    ) : null;
    return (
        <div className="b-donation-form-container">
          <div className="b-donation-form">
            <div className="b-donation-form__recipient">
              {localizeString('DONATION_FORM.SEND_DONATION_LABEL')}&nbsp;
              <span className="b-donation-form-recipient">{this.props.recipientName}</span>
            </div>
            <div className="b-donation-form__input">
              <div className="b-donation-form-sender-amount">
                <div className="b-donation-form-sender-amount__sender">
                  <Input ref="sender" value={this.state.sender} maxLength={Constants.DONATION_SENDER_MAX_LENGTH}
                         placeholder={localizeString('DONATION_FORM.SENDER')} onChange={this.updateSender} required
                         validation={getMockValidation()} lazyValidation readOnly={readOnlySender} fillParent/>
                </div>
                <div className="b-donation-form-sender-amount__amount">
                  <Input ref="sum" value={this.state.sum} type="number" onChange={this.updateSum} required
                         maxLength={5} validation={this.getSumValidation()} lazyValidation wide
                         placeholder={localizeString('DONATION_FORM.AMOUNT')} infoMessage={donationLimitsDescription}/>
                </div>
                <div className="b-donation-form-sender-amount__currency">
                  {Constants.RUBLE}
                </div>
              </div>
            </div>
            {signDonation}
            <div className="b-donation-form__input">
              <TextArea value={this.state.message} placeholder={localizeString('DONATION_FORM.MESSAGE')} rowNumber={4}
                        fillParent countChars maxLength={Constants.MAX_DONATION_CHARACTERS}
                        onChange={this.updateMessage} remark={messageRemark}/>
            </div>
            {this.renderSpeechPreview()}
            {this.renderManualDonationRemark()}
            <div className="b-donation-form__controls">
              <div className="b-donation-form-controls">
                <div className="b-donation-form-controls__item">
                  <Button text={localizeString('DONATION_FORM.SEND')} disabled={!this.state.formValid}
                          onClick={this.sendDonation} wide/>
                </div>
                {cancelButton}
              </div>
            </div>
          </div>
        </div>
    );
  }

  renderWebmoneyForm() {
    return (
        <form ref="webmoneyForm" className="b-donation-form-webmoney" method="POST"
              action="https://merchant.wmtransfer.com/lmi/payment.asp">
            <input name="LMI_PAYEE_PURSE" type="hidden" value={Constants.STREAM_ASSIST_WEB_MONEY_WALLET}/>
            <input name="LMI_PAYMENT_AMOUNT" ref="webmoneyAmount" type="hidden"/>
            <input name="LMI_PAYMENT_DESC" ref="webmoneyDescription" type="hidden" />
            <input name={WEBMONEY_PENDING_DONATION_ID} ref="webmoneyDonationId" type="hidden" />
        </form>
    );
  }

  renderYandexForm() {
    return (
        <form ref="yandexForm" className="b-donation-form-yandex" method="POST"
              action="https://money.yandex.ru/quickpay/confirm.xml">
          <input type="hidden" name="receiver" value={Constants.STREAM_ASSIST_YANDEX_WALLET}/>
          <input type="hidden" name="quickpay-form" value="shop"/>
          <input ref="yandexPaymentType" type="hidden" name="paymentType" value="PC"/>
          <input ref="yandexDonationId" type="hidden" name="label"/>
          <input ref="yandexAmount" type="hidden" name="sum" data-type="number"/>
          <input ref="yandexFormComment" type="hidden" name="formcomment"/>
          <input ref="yandexShortDescription" type="hidden" name="short-dest"/>
          <input ref="yandexTargets" type="hidden" name="targets"/>
        </form>
    );
  }

  renderUnitPayForm() {
    const payUrl = `https://unitpay.ru/pay/${Constants.UNIT_PAY_SHOP_ID}`;
    return (
        <form ref="unitPayForm" className="b-donation-form-unitpay" method="POST" action={payUrl}>
          <input ref="unitPayDonationId" type="hidden" name="account"/>
          <input ref="unitPayAmount" type="hidden" name="sum"/>
          <input ref="unitPayDescription" type="hidden" name="desc"/>
          <input ref="unitPayHideOtherMethods" type="hidden" name="hideOtherMethods" value={false}/>
          <input ref="unitPayHideOtherPSMethods" type="hidden" name="hideOtherPSMethods" value={false}/>
          <input ref="unitPayOperator" type="hidden" name="operator"/>
        </form>
    );
  }

  render() {
    return (
        <div className="b-donation-form-wrapper">
          {this.renderVisibleForm()}
          {this.renderWebmoneyForm()}
          {this.renderYandexForm()}
          {this.renderUnitPayForm()}
        </div>
    );
  }
}

DonationForm.propTypes = {
  recipientId: React.PropTypes.string.isRequired,
  recipientName: React.PropTypes.string.isRequired,
  manual: React.PropTypes.bool,
  ttsPreview: React.PropTypes.bool,
  stressSupport: React.PropTypes.bool,
  withCancel: React.PropTypes.bool,
  donationLimits: React.PropTypes.shape({
    speechEnabled: React.PropTypes.bool.isRequired,
    ttsVoice: React.PropTypes.oneOf(Object.keys(TTS_VOICE).map(key => TTS_VOICE[key])).isRequired,
    minDonationAmount: React.PropTypes.number.isRequired,
    minAmountForSynthesis: React.PropTypes.number.isRequired
  }),
  onButtonClick: React.PropTypes.func,
  paymentMethods: React.PropTypes.shape({
    webmoney: React.PropTypes.bool.isRequired,
    yandex: React.PropTypes.bool.isRequired,
    unitPay: React.PropTypes.bool.isRequired
  }).isRequired
};
