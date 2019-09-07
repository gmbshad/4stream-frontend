import React from 'react';

import DashboardSettingsOption from './DashboardSettingsOption';
import DashboardSettingsForm from './DashboardSettingsForm';
import Input from '../../components/Input';
import Validator from '../../utils/Validator';
import Tooltip from '../../components/Tooltip';
import {localizeString} from '../../localization/LocalizationUtils';
import {INPUT_NO_VALUE} from '../../utils/Constants';
import {getWebMoneyWalletValidation, getYandexWalletValidation, getQiwiWalletValidation} from '../../utils/Validations';

class DashboardSettingsAggregatorPaymentsForm extends DashboardSettingsForm {

  constructor(props) {
    super(props);
    this.updateQiwiWallet = this.updateQiwiWallet.bind(this);
  }

  componentDidMount() {
    this.validator = new Validator(this.setFormValid, [this.refs.qiwiWallet]);
    this.validator.validate();
  }

  updateStateFromStore(settingsStoreState) {
    this.setState({
      qiwiWallet: settingsStoreState.qiwiWallet
    });
  }

  updateQiwiWallet(walletValue) {
    const walletValueNotEmpty = (walletValue !== INPUT_NO_VALUE) ? walletValue : null;
    this.setState({
      qiwiWallet: walletValueNotEmpty
    }, this.validator.validate);
  }

  render() {
    const qiwiWalletTooltipText = localizeString('DASHBOARD_SETTINGS_PAYMENTS.QIWI_WALLET_TOOLTIP');
    const qiwiWalletTooltip = <Tooltip id="qiwiWalletTooltip" text={qiwiWalletTooltipText}/>;
    const qiwiWalletInput = (
        <Input ref="qiwiWallet" className="b-dashboard-settings-wallet-input" value={this.state.qiwiWallet}
               onChange={this.updateQiwiWallet} validation={getQiwiWalletValidation()} maxLength={16} smallFont/>
    );

    const qiwiWalletLabel = localizeString('DASHBOARD_SETTINGS_PAYMENTS.QIWI_WALLET_LABEL');

    return (
        <div className="b-dashboard-settings-form">
          {this.renderHeader(localizeString('DASHBOARD_SETTINGS_PAYMENTS.TITLE_AGGREGATOR'))}
          {this.renderSeparator()}
          {this.renderRemark(localizeString('DASHBOARD_SETTINGS_PAYMENTS.AGGREGATOR_REMARK'))}
          {this.renderImages(['unitpay_small.png'])}
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={qiwiWalletLabel} value={qiwiWalletInput} tooltip={qiwiWalletTooltip}/>
          </div>
          {this.renderSaveButton()}
        </div>
    );
  }
}

class DashboardSettingsDirectPaymentsForm extends DashboardSettingsForm {

  constructor(props) {
    super(props);
    this.updateWebmoneyWallet = this.updateWebmoneyWallet.bind(this);
    this.updateYandexWallet = this.updateYandexWallet.bind(this);
  }

  componentDidMount() {
    this.validator = new Validator(this.setFormValid, [this.refs.webmoneyWallet, this.refs.yandexWallet]);
    this.validator.validate();
  }

  updateStateFromStore(settingsStoreState) {
    this.setState({
      webmoneyWallet: settingsStoreState.webmoneyWallet,
      yandexWallet: settingsStoreState.yandexWallet
    });
  }

  updateWebmoneyWallet(walletValue) {
    const walletValueNotEmpty = (walletValue !== INPUT_NO_VALUE) ? walletValue : null;
    this.setState({
      webmoneyWallet: walletValueNotEmpty
    }, this.validator.validate);
  }

  updateYandexWallet(walletValue) {
    const walletValueNotEmpty = (walletValue !== INPUT_NO_VALUE) ? walletValue : null;
    this.setState({
      yandexWallet: walletValueNotEmpty
    }, this.validator.validate);
  }

  render() {
    const yandexWalletTooltipText = localizeString('DASHBOARD_SETTINGS_PAYMENTS.YANDEX_WALLET_TOOLTIP');
    const yandexWalletTooltip = <Tooltip id="yandexWalletTooltip" text={yandexWalletTooltipText}/>;
    const yandexWalletInput = (
        <Input ref="yandexWallet" className="b-dashboard-settings-wallet-input" value={this.state.yandexWallet}
               onChange={this.updateYandexWallet} validation={getYandexWalletValidation()} maxLength={16} smallFont/>
    );

    const webmoneyWalletTooltipText = localizeString('DASHBOARD_SETTINGS_PAYMENTS.WEBMONEY_WALLET_TOOLTIP');
    const webmoneyWalletTooltip = <Tooltip id="webmoneyWalletTooltip" text={webmoneyWalletTooltipText}/>;
    const webmoneyWalletInput = (
        <Input ref="webmoneyWallet" className="b-dashboard-settings-wallet-input" value={this.state.webmoneyWallet}
               onChange={this.updateWebmoneyWallet} validation={getWebMoneyWalletValidation()} maxLength={13} smallFont/>
    );

    const yandexWalletLabel = localizeString('DASHBOARD_SETTINGS_PAYMENTS.YANDEX_WALLET_LABEL');
    const webmoneyWalletLabel = localizeString('DASHBOARD_SETTINGS_PAYMENTS.WEBMONEY_WALLET_LABEL');

    return (
        <div className="b-dashboard-settings-form">
          {this.renderHeader(localizeString('DASHBOARD_SETTINGS_PAYMENTS.TITLE_DIRECT'))}
          {this.renderSeparator()}
          {this.renderRemark(localizeString('DASHBOARD_SETTINGS_PAYMENTS.YANDEX_REMARK'))}
          {this.renderImages(['yandex.png', 'card.png'])}
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={yandexWalletLabel} value={yandexWalletInput} tooltip={yandexWalletTooltip}/>
          </div>
          {this.renderRemark(localizeString('DASHBOARD_SETTINGS_PAYMENTS.WEBMONEY_REMARK'))}
          {this.renderImages(['wm.png'])}
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={webmoneyWalletLabel} value={webmoneyWalletInput} tooltip={webmoneyWalletTooltip}/>
          </div>
          {this.renderSaveButton()}
        </div>
    );
  }
}

class DashboardSettingsPayments extends React.Component {
  render() {
    return (
        <div className="b-dashboard-category-content">
          <div className="b-dashboard-category-content__part b-dashboard-category-content__part--margin-bottom">
            <DashboardSettingsAggregatorPaymentsForm/>
          </div>
          <div className="b-dashboard-category-content__part">
            <DashboardSettingsDirectPaymentsForm/>
          </div>
        </div>
    );
  }
}

export default DashboardSettingsPayments;
