import React from 'react';
import {sprintf} from 'sprintf-js';

import UserMediaActions from '../../actions/UserMediaActions';
import UserMediaStore from '../../stores/UserMediaStore';
import SoundActions from '../../actions/SoundActions';
import DonationsActions from '../../actions/DonationsActions';
import DonationAlertSettingsActions from '../../actions/DonationAlertSettingsActions';
import DonationAlertSettingsStore from '../../stores/DonationAlertSettingsStore';
import ModalDialogActions from '../../actions/ModalDialogActions';
import Constants, {MEDIA_TYPE} from '../../utils/Constants';
import {getDonationWidgetUrl} from '../../utils/UrlUtils';
import DashboardSettingsForm from './DashboardSettingsForm';
import DashboardSettingsOption from './DashboardSettingsOption';
import {SoundUpload, ImageUpload} from '../../components/FileUpload';
import Input from '../../components/Input';
import InputRange from '../../components/InputRange';
import ModalDialogIFrame from '../../components/modal/ModalDialogIFrame';
import {getDonationTitleTemplateValidation} from '../../utils/Validations';
import Validator from '../../utils/Validator';
import Tooltip from '../../components/Tooltip';
import AnimationSelect from '../../components/AnimationSelect';
import {ANIMATION_TYPE} from '../../components/AnimationSelect';
import {localizeString} from '../../localization/LocalizationUtils';
import DashboardInputWithAction from './DashboardInputWithAction';


class DashboardWidgetsAlertsGeneralForm extends DashboardSettingsForm {
  constructor(props) {
    super(props);
    this.updateSoundVolume = this.updateSoundVolume.bind(this);
    this.updateSpeechVolume = this.updateSpeechVolume.bind(this);
    this.updateDonationTitleTemplate = this.updateDonationTitleTemplate.bind(this);
    this.updateStartAnimation = this.updateStartAnimation.bind(this);
    this.updateEndAnimation = this.updateEndAnimation.bind(this);
    this.openTestDonationIFrame = this.openTestDonationIFrame.bind(this);
  }

  componentDidMount() {
    this.validator = new Validator(this.setFormValid, [this.refs.donationTitle]);
    this.validator.validate();

    DonationAlertSettingsActions.requestDonationAlertSettings.defer();
  }

  getActionsToListen() {
    return [DonationAlertSettingsActions.receiveDonationAlertSettings.id,
      DonationAlertSettingsActions.receiveDonationAlertSettingsUpdate.id];
  }

  getStore() {
    return DonationAlertSettingsStore;
  }

  getSaveAction() {
    return DonationAlertSettingsActions.requestDonationAlertSettingsUpdate;
  }

  updateStateFromStore(donationAlertSettingsStoreState) {
    this.setState({
      soundVolume: donationAlertSettingsStoreState.soundVolume,
      speechVolume: donationAlertSettingsStoreState.speechVolume,
      donationTitleTemplate: donationAlertSettingsStoreState.donationTitleTemplate,
      startAnimation: donationAlertSettingsStoreState.startAnimation,
      endAnimation: donationAlertSettingsStoreState.endAnimation
    });
  }

  updateSoundVolume(value) {
    this.setState({
      soundVolume: value
    });
  }

  updateSpeechVolume(value) {
    this.setState({
      speechVolume: value
    });
  }

  updateDonationTitleTemplate(value) {
    this.setState({
      donationTitleTemplate: value
    }, this.validator.validate);
  }

  updateStartAnimation(value) {
    this.setState({
      startAnimation: value
    });
  }

  updateEndAnimation(value) {
    this.setState({
      endAnimation: value
    });
  }

  openTestDonationIFrame() {
    const title = localizeString('TEST_DONATION_DIALOG.TITLE');
    const modal = (
        <ModalDialogIFrame title={title}
                           source={getDonationWidgetUrl({token: this.props.authStore.token, testMode: true})}
                           width={640}
                           height={480}/>
    );
    ModalDialogActions.showModal(modal);
  }

  render() {
    const donationWidgetUrl = getDonationWidgetUrl({token: this.props.authStore.token, testMode: false, full: true});
    const donationWidgetLink = <DashboardInputWithAction value={donationWidgetUrl}/>;

    const donationWidgetTest = this.renderActionLinkWithIcon(DonationsActions.requestAddTestDonation, 'fa-paper-plane',
        localizeString('DASHBOARD_WIDGETS_ALERTS.LAUNCH_TEST_DONATION'));
    const donationWidgetTestShow = this.renderActionLinkWithIcon(this.openTestDonationIFrame, 'fa-window-maximize',
        localizeString('DASHBOARD_WIDGETS_ALERTS.LAUNCH_TEST_DONATION_SHOW'));
    const donationWidgetTestLinks = (
        <div className="b-dashboard-settings-test-donation-links">
          <div className="b-dashboard-settings-test-donation-links__item b-dashboard-settings-test-donation-links__item--margin-right">
            {donationWidgetTest}
          </div>
          <div className="b-dashboard-settings-test-donation-links__item">
            {donationWidgetTestShow}
          </div>
        </div>
    );

    const donationTitleTemplate = (
        <Input ref="donationTitle" className="b-dashboard-settings-donation-title-template"
               value={this.state.donationTitleTemplate} onChange={this.updateDonationTitleTemplate}
               maxLength={Constants.DONATION_TITLE_TEMPLATE_MAX_LENGTH} smallFont
               validation={getDonationTitleTemplateValidation()} required/>
    );

    const soundVolumeInput = (
        <InputRange className="b-dashboard-settings-donation-sound-volume" value={this.state.soundVolume}
                    onChange={this.updateSoundVolume} min={Constants.MIN_VOLUME} max={Constants.MAX_VOLUME}/>
    );

    const speechVolumeInput = (
        <InputRange className="b-dashboard-settings-donation-speech-volume" value={this.state.speechVolume}
                    onChange={this.updateSpeechVolume} min={Constants.MIN_VOLUME} max={Constants.MAX_VOLUME}/>
    );

    const startAnimation = (
        <AnimationSelect type={ANIMATION_TYPE.IN} value={this.state.startAnimation} onChange={this.updateStartAnimation}
                         smallFont/>
    );

    const endAnimation = (
        <AnimationSelect type={ANIMATION_TYPE.OUT} value={this.state.endAnimation} onChange={this.updateEndAnimation}
                         smallFont/>
    );

    const pAmount = Constants.DONATION_TITLE_AMOUNT_TEMPLATE;
    const pSender = Constants.DONATION_TITLE_SENDER_TEMPLATE;
    const donationTitleParameters = {
      pSender: pSender,
      pAmount: pAmount,
      defaultValue: Constants.DONATION_TITLE_TEMPLATE_DEFAULT
    };

    const testDonationTooltipText = sprintf(localizeString('DASHBOARD_WIDGETS_ALERTS.TEST_DONATION_TOOLTIP'),
        donationTitleParameters);
    const testDonationTooltip = <Tooltip id="testDonationTooltip" text={testDonationTooltipText}/>;

    const donationTitleTooltipText = sprintf(localizeString('DASHBOARD_WIDGETS_ALERTS.DONATION_TITLE_TOOLTIP'),
        donationTitleParameters);
    const donationTitleTooltip = <Tooltip id="donationTitleTooltip" text={donationTitleTooltipText}/>;

    const soundVolumeTooltipText = localizeString('DASHBOARD_WIDGETS_ALERTS.SOUND_VOLUME_TOOLTIP');
    const soundVolumeTooltip = (
        <Tooltip id="soundVolumeTooltip" text={soundVolumeTooltipText}/>
    );

    const speechVolumeTooltipText = localizeString('DASHBOARD_WIDGETS_ALERTS.SPEECH_VOLUME_TOOLTIP');
    const speechVolumeTooltip = (
        <Tooltip id="speechVolumeTooltip" text={speechVolumeTooltipText}/>
    );

    const startAnimationTooltipText = localizeString('DASHBOARD_WIDGETS_ALERTS.START_ANIMATION_TOOLTIP');
    const startAnimationTooltip = (
        <Tooltip id="startAnimationTooltip" text={startAnimationTooltipText}/>
    );

    const endAnimationTooltipText = localizeString('DASHBOARD_WIDGETS_ALERTS.END_ANIMATION_TOOLTIP');
    const endAnimationTooltip = (
        <Tooltip id="endAnimationTooltip" text={endAnimationTooltipText}/>
    );

    const linkLabel = localizeString('DASHBOARD_LINK_INPUT.LINK_LABEL');
    const testDonationLabel = localizeString('DASHBOARD_WIDGETS_ALERTS.TEST_DONATION_LABEL');
    const donationTitleTemplateLabel = localizeString('DASHBOARD_WIDGETS_ALERTS.TITLE_TEMPLATE_LABEL');
    const soundVolumeLabel = localizeString('DASHBOARD_WIDGETS_ALERTS.DONATION_SOUND_VOLUME_LABEL');
    const speechVolumeLabel = localizeString('DASHBOARD_WIDGETS_ALERTS.DONATION_SPEECH_VOLUME_LABEL');
    const startAnimationLabel = localizeString('DASHBOARD_WIDGETS_ALERTS.START_ANIMATION_LABEL');
    const endAnimationLabel = localizeString('DASHBOARD_WIDGETS_ALERTS.END_ANIMATION_LABEL');
    return (
        <div className="b-dashboard-settings-form">
          {this.renderHeader(localizeString('DASHBOARD_WIDGETS_ALERTS.TITLE_GENERAL'))}
          {this.renderSeparator()}
          {this.renderWarning(localizeString('DASHBOARD_WIDGETS.LINK_REMARK'))}
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={linkLabel} value={donationWidgetLink} />
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={testDonationLabel} value={donationWidgetTestLinks} tooltip={testDonationTooltip}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={donationTitleTemplateLabel} value={donationTitleTemplate} tooltip={donationTitleTooltip}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={soundVolumeLabel} value={soundVolumeInput} tooltip={soundVolumeTooltip}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={speechVolumeLabel} value={speechVolumeInput} tooltip={speechVolumeTooltip}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={startAnimationLabel} value={startAnimation} tooltip={startAnimationTooltip}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={endAnimationLabel} value={endAnimation} tooltip={endAnimationTooltip}/>
          </div>
          {this.renderSaveButton()}
        </div>
    );
  }
}

DashboardWidgetsAlertsGeneralForm.propTypes = Object.assign({}, DashboardSettingsForm.propTypes, {
  authStore: React.PropTypes.shape({
    token: React.PropTypes.string.isRequired     // NULLNU
  }).isRequired
});

class DashboardWidgetsAlertsMediaForm extends DashboardSettingsForm {

  componentWillMount() {
    super.componentWillMount();

    this.actionListener.addActionListener(
        UserMediaActions.receiveDonationMediaUpdate.id, (mediaId) => {
          this.resetMediaInput(mediaId);
          this.setMediaInputNoOperationInProgress(mediaId);
          if (mediaId === MEDIA_TYPE.DONATION_IMAGE) {
            this.reloadImage();
          }
        });

    this.actionListener.addActionListener(
        UserMediaActions.receiveDonationMediaUpdateError.id, ({mediaId}) => {
          this.setMediaInputNoOperationInProgress(mediaId);
        });

    this.actionListener.addActionListener(
        UserMediaActions.receiveDonationMediaDelete.id, (mediaId) => {
          if (mediaId === MEDIA_TYPE.DONATION_IMAGE) {
            this.reloadImage();
          }
        });
  }

  componentDidMount() {
    UserMediaActions.requestMediaMeta.defer();
  }

  getActionsToListen() {
    return [UserMediaActions.receiveMediaMeta.id];
  }

  getStore() {
    return UserMediaStore;
  }

  updateStateFromStore(userMediaStoreState) {
    this.setState({
      donationSoundFileName: userMediaStoreState.donationSoundFileName,
      donationImageFileName: userMediaStoreState.donationImageFileName
    });
  }

  resetMediaInput(mediaId) {
    this.refs[mediaId].resetFileInput();
  }

  setMediaInputNoOperationInProgress(mediaId) {
    this.refs[mediaId].setFileOperationInProgress(false);
  }

  reloadImage() {
    this.refs[MEDIA_TYPE.DONATION_IMAGE].loadImagePreview();
  }

  handleDonationSoundSave(formData, fileName) {
    UserMediaActions.requestDonationMediaUpdate({formData, mediaId: MEDIA_TYPE.DONATION_SOUND, fileName});
  }

  handleDonationSoundDelete() {
    UserMediaActions.requestDonationMediaDelete(MEDIA_TYPE.DONATION_SOUND);
  }

  handleDonationSoundPlay() {
    SoundActions.playDonationSound();
  }

  handleDonationSoundStop() {
    SoundActions.stopSound();
  }

  handleDonationPictureSave(formData, fileName) {
    UserMediaActions.requestDonationMediaUpdate({formData, mediaId: MEDIA_TYPE.DONATION_IMAGE, fileName});
  }

  handleDonationPictureDelete() {
    UserMediaActions.requestDonationMediaDelete(MEDIA_TYPE.DONATION_IMAGE);
  }

  render() {
    const donationSound = (
        <SoundUpload ref={MEDIA_TYPE.DONATION_SOUND}
                     currentUploadedFileName={this.state.donationSoundFileName}
                     onPlay={this.handleDonationSoundPlay}
                     onStop={this.handleDonationSoundStop}
                     onSave={this.handleDonationSoundSave}
                     onDelete={this.handleDonationSoundDelete}
        />
    );

    const donationPicture = (
        <ImageUpload ref={MEDIA_TYPE.DONATION_IMAGE}
                     currentUploadedFileName={this.state.donationImageFileName}
                     onSave={this.handleDonationPictureSave}
                     onDelete={this.handleDonationPictureDelete}
        />
    );

    const donationAudioLabel = localizeString('DASHBOARD_WIDGETS_ALERTS.DONATION_AUDIO');
    const donationImageLabel = localizeString('DASHBOARD_WIDGETS_ALERTS.DONATION_IMAGE');
    return (
        <div className="b-dashboard-settings-form">
          {this.renderHeader(localizeString('DASHBOARD_WIDGETS_ALERTS.TITLE_MEDIA'))}
          {this.renderSeparator()}
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={donationAudioLabel} value={donationSound}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={donationImageLabel} value={donationPicture}/>
          </div>
        </div>
    );
  }
}

class DashboardWidgetsAlertsFonts extends DashboardSettingsForm {

  getActionsToListen() {
    return [DonationAlertSettingsActions.receiveDonationAlertSettings.id,
      DonationAlertSettingsActions.receiveDonationAlertSettingsUpdate.id];
  }

  getStore() {
    return DonationAlertSettingsStore;
  }

  getSaveAction() {
    return DonationAlertSettingsActions.requestDonationAlertSettingsUpdate;
  }

  updateStateFromStore(donationAlertSettingsStoreState) {
    this.setState({
      titleFontSettings: donationAlertSettingsStoreState.titleFontSettings,
      textFontSettings: donationAlertSettingsStoreState.textFontSettings
    });
  }

  render() {
    const {titleFontSettings, textFontSettings} = this.state;

    const titleSettingsLabel = localizeString('DASHBOARD_WIDGETS_ALERTS.TITLE_FONT_LABEL');
    const titleSettings = this.renderFontSettings(localizeString('FONT_DIALOG.ALERT_TITLE_TITLE'), titleFontSettings,
        DonationAlertSettingsActions.requestDonationAlertSettingsUpdate, 'titleFontSettings');

    const messageSettingsLabel = localizeString('DASHBOARD_WIDGETS_ALERTS.MESSAGE_FONT_LABEL');
    const messageSettings = this.renderFontSettings(localizeString('FONT_DIALOG.ALERT_MESSAGE_TITLE'), textFontSettings,
        DonationAlertSettingsActions.requestDonationAlertSettingsUpdate, 'textFontSettings');

    return (
        <div className="b-dashboard-settings-form">
          {this.renderHeader(localizeString('DASHBOARD_WIDGETS_ALERTS.TITLE_FONTS'))}
          {this.renderSeparator()}
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={titleSettingsLabel} value={titleSettings}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={messageSettingsLabel} value={messageSettings}/>
          </div>
        </div>
    );
  }
}

class DashboardWidgetsAlerts extends React.Component {
  render() {
    return (
        <div className="b-dashboard-category-content">
          <div className="b-dashboard-category-content__part b-dashboard-category-content__part--margin-bottom">
            <DashboardWidgetsAlertsGeneralForm authStore={this.props.authStore}/>
          </div>
          <div className="b-dashboard-category-content__part b-dashboard-category-content__part--margin-bottom">
            <DashboardWidgetsAlertsMediaForm/>
          </div>
          <div className="b-dashboard-category-content__part">
            <DashboardWidgetsAlertsFonts/>
          </div>
        </div>
    );
  }
}

DashboardWidgetsAlerts.propTypes = Object.assign({}, DashboardSettingsForm.propTypes, {
  authStore: React.PropTypes.shape({
    token: React.PropTypes.string.isRequired     // NULLNU
  }).isRequired
});

export default DashboardWidgetsAlerts;
