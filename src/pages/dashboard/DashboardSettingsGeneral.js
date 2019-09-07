import React from 'react';

import AuthStore from '../../stores/AuthStore';
import AuthActions from '../../actions/AuthActions';
import SoundActions from '../../actions/SoundActions';
import DashboardSettingsForm from './DashboardSettingsForm';
import DashboardSettingsOption from './DashboardSettingsOption';
import TimeZonePicker from '../../components/TimeZonePicker';
import Input from '../../components/Input';
import DashboardInputWithAction from './DashboardInputWithAction';
import Select from '../../components/Select';
import ActionIcon from '../../components/ActionIcon';
import {ACTION_TYPE} from '../../components/ActionIcon';
import Validator from '../../utils/Validator';
import {getMinDonationAmountValidation, getMinTTSAmountValidation} from '../../utils/Validations';
import Constants from '../../utils/Constants';
import Tooltip from '../../components/Tooltip';
import {localizeString} from '../../localization/LocalizationUtils';
import {TTS_STATUS, TTS_VOICE} from '../../utils/Constants';
import {NOTIFY_TWITCH_CHAT_DONATIONS, READ_DONATION_META} from '../../utils/Constants';


class DashboardSettingsGeneralForm extends DashboardSettingsForm {

  constructor(props) {
    super(props);
    this.updateTTSStatus = this.updateTTSStatus.bind(this);
    this.updateTTSVoice = this.updateTTSVoice.bind(this);
    this.updateReadDonationMeta = this.updateReadDonationMeta.bind(this);
    this.updateMinDonationAmount = this.updateMinDonationAmount.bind(this);
    this.updateMinTTSAmount = this.updateMinTTSAmount.bind(this);
    this.updateTimeZone = this.updateTimeZone.bind(this);
    this.updateTwitchChatNotifications = this.updateTwitchChatNotifications.bind(this);
    this.getMinDonationAmount = this.getMinDonationAmount.bind(this);
  }

  componentDidMount() {
    this.validator = new Validator(
        this.setFormValid, [this.refs.minDonationAmount, this.refs.minDonationAmountTTS]);
    this.validator.validate();
  }
  
  updateStateFromStore(settingsStoreState) {
    this.setState({
      speechEnabled: settingsStoreState.speechEnabled,
      ttsVoice: settingsStoreState.ttsVoice,
      readDonationMeta: settingsStoreState.readDonationMeta,
      minDonationAmount: settingsStoreState.minDonationAmount,
      minAmountForSynthesis: settingsStoreState.minAmountForSynthesis,
      timeZone: settingsStoreState.timeZone,
      notifyTwitchChatDonations: settingsStoreState.notifyTwitchChatDonations
    });
  }

  updateTTSStatus(event) {
    const ttsValue = event.target.value;
    this.setState({
      speechEnabled: ttsValue === TTS_STATUS.ENABLED
    });
  }

  updateTTSVoice(event) {
    const ttsVoice = event.target.value;
    this.setState({ttsVoice});
  }

  updateReadDonationMeta(event) {
    const value = event.target.value;
    this.setState({
      readDonationMeta: value === READ_DONATION_META.YES
    });
  }

  updateMinDonationAmount(value) {
    this.setState({
      minDonationAmount: value
    }, () => {
      // minDonationAmountTTS depends on minDonationAmount
      this.refs.minDonationAmountTTS.validate(this.state.minAmountForSynthesis, this.validator.validate);
    });
  }

  updateMinTTSAmount(value) {
    this.setState({
      minAmountForSynthesis: value
    }, this.validator.validate);
  }

  updateTimeZone(nextValue) {
    this.setState({
      timeZone: nextValue
    });
  }

  updateTwitchChatNotifications(event) {
    const value = event.target.value;
    this.setState({
      notifyTwitchChatDonations: value === NOTIFY_TWITCH_CHAT_DONATIONS.YES
    });
  }

  getMinDonationAmount() {
    return this.state.minDonationAmount;
  }

  getTTSOptions() {
    return [
      {
        value: TTS_STATUS.ENABLED,
        label: localizeString('DASHBOARD_SETTINGS_GENERAL.TTS_ENABLED')
      },
      {
        value: TTS_STATUS.DISABLED,
        label: localizeString('DASHBOARD_SETTINGS_GENERAL.TTS_DISABLED')
      }
    ];
  }

  getTTSVoiceOptions() {
    return [
      {
        value: TTS_VOICE.MAXIM,
        label: localizeString('TTS_VOICE.MAXIM')
      },
      {
        value: TTS_VOICE.TATYANA,
        label: localizeString('TTS_VOICE.TATYANA')
      },
      {
        value: TTS_VOICE.ALEKSANDR,
        label: localizeString('TTS_VOICE.ALEKSANDR')
      },
    ];
  }

  getNotifyTwitchChatDonationsOptions() {
    return [
      {
        value: NOTIFY_TWITCH_CHAT_DONATIONS.YES,
        label: localizeString('DASHBOARD_SETTINGS_GENERAL.TWITCH_CHAT_NOTIFICATIONS_ENABLED')
      },
      {
        value: NOTIFY_TWITCH_CHAT_DONATIONS.NO,
        label: localizeString('DASHBOARD_SETTINGS_GENERAL.TWITCH_CHAT_NOTIFICATIONS_DISABLED')
      }
    ];
  }

  getReadDonationMetaOptions() {
    return [
      {
        value: READ_DONATION_META.YES,
        label: localizeString('DASHBOARD_SETTINGS_GENERAL.TTS_MODE_MESSAGE_AND_META')
      },
      {
        value: READ_DONATION_META.NO,
        label: localizeString('DASHBOARD_SETTINGS_GENERAL.TTS_MODE_MESSAGE')
      }
    ];
  }

  renderVoiceSelect(select) {
    const playVoiceTest = SoundActions.playVoiceTestSound.bind(this, this.state.ttsVoice);
    return (
        <div className="b-dashboard-settings-tts-voice">
          <div className="b-dashboard-settings-tts-voice__select">
            {select}
          </div>
          <div className="b-dashboard-settings-tts-voice__preview">
            <ActionIcon type={ACTION_TYPE.PLAY} onAction={playVoiceTest}/>
          </div>
        </div>
    );
  }

  render() {
    const ttsValue = this.state.speechEnabled ? TTS_STATUS.ENABLED : TTS_STATUS.DISABLED;
    const ttsTooltipText = localizeString('DASHBOARD_SETTINGS_GENERAL.TTS_TOOLTIP');
    const ttsTooltip = <Tooltip id="ttsTooltip" text={ttsTooltipText}/>;
    const speechSynthesisSelect = (
        <Select value={ttsValue} options={this.getTTSOptions()} onChange={this.updateTTSStatus} smallFont/>
    );

    const ttsVoiceValue = this.state.ttsVoice;
    const ttsVoiceTooltipText = localizeString('DASHBOARD_SETTINGS_GENERAL.TTS_VOICE_TOOLTIP');
    const ttsVoiceTooltip = <Tooltip id="ttsVoiceTooltip" text={ttsVoiceTooltipText}/>;
    const ttsVoiceSelect = this.renderVoiceSelect(
        <Select value={ttsVoiceValue} options={this.getTTSVoiceOptions()} onChange={this.updateTTSVoice} smallFont/>
    );

    const readDonationMetaValue = this.state.readDonationMeta
        ? READ_DONATION_META.YES : READ_DONATION_META.NO;
    const readDonationMetaTooltipText = localizeString('DASHBOARD_SETTINGS_GENERAL.READ_DONATION_META_TOOLTIP');
    const readDonationMetaTooltip = <Tooltip id="readDonationMetaTooltip" text={readDonationMetaTooltipText}/>;
    const readDonationMetaSelect = (
        <Select value={readDonationMetaValue} options={this.getReadDonationMetaOptions()}
                onChange={this.updateReadDonationMeta} smallFont/>
    );

    const minAmountTooltipText = localizeString('DASHBOARD_SETTINGS_GENERAL.MIN_AMOUNT_TOOLTIP');
    const minAmountTooltip = (
        <Tooltip id="minDonationTooltip" text={minAmountTooltipText}/>
    );
    const minDonationAmountInput = (
        <Input ref="minDonationAmount" className="b-dashboard-settings-min-donation-amount" maxLength={5}
            value={this.state.minDonationAmount} onChange={this.updateMinDonationAmount} required
            validation={getMinDonationAmountValidation(Constants.DEFAULT_MIN_DONATION_AMOUNT, Constants.MAX_DONATION_AMOUNT)} smallFont/>
    );

    const minTTSTooltipText = localizeString('DASHBOARD_SETTINGS_GENERAL.MIN_TTS_AMOUNT_TOOLTIP');
    const minTTSTooltip = <Tooltip id="minTTSTooltip" text={minTTSTooltipText}/>;
    const minAmountForSynthesisInput = (
        <Input ref="minDonationAmountTTS" className="b-dashboard-settings-min-tts-amount" maxLength={5}
            value={this.state.minAmountForSynthesis} onChange={this.updateMinTTSAmount} required
            validation={getMinTTSAmountValidation(this.getMinDonationAmount, Constants.MAX_DONATION_AMOUNT)} smallFont/>
    );

    const timeZoneTooltipText = localizeString('DASHBOARD_SETTINGS_GENERAL.TIME_ZONE_TOOLTIP');
    const timeZoneTooltip = <Tooltip id="timeZoneTooltip" text={timeZoneTooltipText}/>;
    const timeZonePicker = (
        <TimeZonePicker value={this.state.timeZone} onChange={this.updateTimeZone}/>
    );

    const notifyTwitchChatDonationsValue = this.state.notifyTwitchChatDonations
        ? NOTIFY_TWITCH_CHAT_DONATIONS.YES : NOTIFY_TWITCH_CHAT_DONATIONS.NO;
    const notifyTwitchChatDonationsTooltipText = localizeString('DASHBOARD_SETTINGS_GENERAL.TWITCH_CHAT_NOTIFICATIONS_TOOLTIP');
    const notifyTwitchChatDonationsTooltip = <Tooltip id="notifyTwitchChatDonationsTooltip" text={notifyTwitchChatDonationsTooltipText}/>;
    const notifyTwitchChatDonationsSelect = (
        <Select value={notifyTwitchChatDonationsValue} options={this.getNotifyTwitchChatDonationsOptions()}
                onChange={this.updateTwitchChatNotifications} smallFont/>
    );

    const ttsLabel = localizeString('DASHBOARD_SETTINGS_GENERAL.TTS_LABEL');
    const ttsVoiceLabel = localizeString('DASHBOARD_SETTINGS_GENERAL.TTS_VOICE_LABEL');
    const readDonationMetaLabel = localizeString('DASHBOARD_SETTINGS_GENERAL.READ_DONATION_META_LABEL');
    const minAmountLabel = localizeString('DASHBOARD_SETTINGS_GENERAL.MIN_AMOUNT_LABEL');
    const minAmountTTSLabel = localizeString('DASHBOARD_SETTINGS_GENERAL.MIN_TTS_AMOUNT_LABEL');
    const timeZoneLabel = localizeString('DASHBOARD_SETTINGS_GENERAL.TIME_ZONE_LABEL');
    const updateTwitchChatNotificationsLabel = localizeString('DASHBOARD_SETTINGS_GENERAL.TWITCH_CHAT_NOTIFICATIONS_LABEL');
    return (
        <div className="b-dashboard-settings-form">
          {this.renderHeader(localizeString('DASHBOARD_SETTINGS_GENERAL.TITLE'))}
          {this.renderSeparator()}
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={ttsLabel} value={speechSynthesisSelect} tooltip={ttsTooltip}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={ttsVoiceLabel} value={ttsVoiceSelect} tooltip={ttsVoiceTooltip}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={readDonationMetaLabel} value={readDonationMetaSelect}
                                     tooltip={readDonationMetaTooltip}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={minAmountLabel} value={minDonationAmountInput} tooltip={minAmountTooltip}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={minAmountTTSLabel} value={minAmountForSynthesisInput} tooltip={minTTSTooltip}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={timeZoneLabel} value={timeZonePicker} tooltip={timeZoneTooltip}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={updateTwitchChatNotificationsLabel} value={notifyTwitchChatDonationsSelect}
                                     tooltip={notifyTwitchChatDonationsTooltip}/>
          </div>
          {this.renderSaveButton()}
        </div>
    );
  }
}

class DashboardSettingsSecurityForm extends DashboardSettingsForm {

  componentWillMount() {
    super.componentWillMount();

    this.setState({
      token: AuthStore.getState().token
    });
  }

  getActionsToListen() {
    return [AuthActions.receiveLoginInfo.id];
  }

  getStore() {
    return AuthStore;
  }

  updateStateFromStore(authStoreState) {
    this.setState({
      token: authStoreState.token
    });
  }

  render() {
    const tokenLabel = localizeString('DASHBOARD_SETTINGS_GENERAL.TOKEN_LABEL');
    const resetTokenAction = {
      label: localizeString('DASHBOARD_SETTINGS_GENERAL.TOKEN_RESET_LABEL'),
      faClass: 'fa-refresh',
      action: AuthActions.requestResetUserToken
    };
    const resetToken = <DashboardInputWithAction value={this.state.token} action={resetTokenAction}/>;
    return (
        <div className="b-dashboard-settings-form">
          {this.renderHeader(localizeString('DASHBOARD_SETTINGS_GENERAL.TITLE_SECURITY'))}
          {this.renderSeparator()}
          {this.renderWarning(localizeString('DASHBOARD_SETTINGS_GENERAL.TOKEN_REMARK'))}
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={tokenLabel} value={resetToken}/>
          </div>
        </div>
    );
  }
}

class DashboardSettingsGeneral extends React.Component {
  render() {
    return (
      <div className="b-dashboard-category-content">
        <div className="b-dashboard-category-content__part b-dashboard-category-content__part--margin-bottom">
          <DashboardSettingsGeneralForm/>
        </div>
        <div className="b-dashboard-category-content__part">
          <DashboardSettingsSecurityForm/>
        </div>
      </div>
    );
  }
}

export default DashboardSettingsGeneral;
