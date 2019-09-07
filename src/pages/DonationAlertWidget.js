import React from 'react';
import alt from '../alt';
import ActionListeners from 'alt-utils/lib/ActionListeners';
import classNames from 'classnames';

import {localizeString} from '../localization/LocalizationUtils';
import Constants from '../utils/Constants';
import {DONATION_SIGNATURE} from '../utils/Constants';
import {getDonationSpeechUrl, getDonationSoundUrl, getDonationImageUrl} from '../utils/UrlUtils';
import {getSupportedAudioFormat, getSupportedAudioMimeType, canPlayAudio} from '../utils/AudioUtils';
import DonationAlertSettingsStore from '../stores/DonationAlertSettingsStore';
import DonationAlertSettingsActions from '../actions/DonationAlertSettingsActions';
import {loadImage} from '../utils/ImageUtils';
import {formatRubles} from '../utils/CurrencyUtils';
import DonationWidget from './DonationWidget';
import StyledText from '../components/StyledText';

const LOADING_STATE = {
  IN_PROGRESS: 'in_progress',
  LOADED: 'loaded',
  ERROR: 'error'
};

const PROCESS_DONATIONS_TIMER = 'processDonationsTimer';

export default class DonationAlertWidget extends DonationWidget {
  constructor(props) {
    super(props);

    this.processDonations = this.processDonations.bind(this);
    this.playNextDonation = this.playNextDonation.bind(this);
    this.onAnimationEnd = this.onAnimationEnd.bind(this);
    this.donationQueue = [];
  }

  componentWillMount() {
    super.componentWillMount();

    // getDonationImageUrl() must be called only once, because it returns different url each time
    const imageUrl = getDonationImageUrl(this.getToken());
    const donationSoundUrl = getDonationSoundUrl(getSupportedAudioFormat(), this.getToken());
    const {titleFontSettings, textFontSettings} = DonationAlertSettingsStore.getState();
    this.setState({
      activeDonation: null,
      showedAnyDonations: false,
      preparedDonation: null,
      soundVolume: Constants.DEFAULT_VOLUME,
      speechVolume: Constants.DEFAULT_VOLUME,
      donationTitleTemplate: Constants.DONATION_TITLE_TEMPLATE_DEFAULT,
      startAnimation: null,
      endAnimation: null,
      titleFontSettings: titleFontSettings,
      textFontSettings: textFontSettings,
      playingEndAnimation: false,
      imageUrl: imageUrl,
      donationSoundUrl: donationSoundUrl,
      donationSpeechUrl: null,
      imageLoadingState: LOADING_STATE.IN_PROGRESS,
      donationSoundLoadingState: LOADING_STATE.IN_PROGRESS,
      donationSpeechLoadingState: LOADING_STATE.IN_PROGRESS,
      [PROCESS_DONATIONS_TIMER]: null
    });

    this.actionListener = new ActionListeners(alt);
    this.actionListener.addActionListener(
        DonationAlertSettingsActions.receiveDonationAlertSettings.id, () => {
          const state = DonationAlertSettingsStore.getState();
          this.setState({
            soundVolume: state.soundVolume,
            speechVolume: state.speechVolume,
            donationTitleTemplate: state.donationTitleTemplate,
            startAnimation: state.startAnimation,
            endAnimation: state.endAnimation,
            titleFontSettings: state.titleFontSettings,
            textFontSettings: state.textFontSettings
          });
        }
    );

    this.loadImage(imageUrl);

    this.createProcessDonationsTimer(Constants.DONATION_PROCESSING_INTERVAL_SEC);
  }

  componentDidMount() {
    this.initAudioElements();
  }

  clearResources() {
    super.clearResources();

    clearTimeout(this.state[PROCESS_DONATIONS_TIMER]);
    this.actionListener.removeAllActionListeners();
  }

  createProcessDonationsTimer(delaySeconds) {
    this.createTimer(this.processDonations, delaySeconds, PROCESS_DONATIONS_TIMER);
  }

  initAudioElements() {
    this.initDonationAudio();
    this.initDonationSpeech();
  }

  getDonationMeta(donation) {
    const template = this.state.donationTitleTemplate;
    let sender = donation.sender;
    if (donation.signature === DONATION_SIGNATURE.TWITCH) {
      sender = Constants.DONATION_SENDER_TWITCH_PLACEHOLDER + sender;
    }
    return template.replace(Constants.DONATION_TITLE_SENDER_TEMPLATE, sender)
            .replace(Constants.DONATION_TITLE_AMOUNT_TEMPLATE, formatRubles(donation.sum));
  }

  loadImage(imageUrl) {
    loadImage(imageUrl,
        () => this.setState({imageLoadingState: LOADING_STATE.LOADED}),
        () => this.setState({imageLoadingState: LOADING_STATE.ERROR})
    );
  }

  reloadImage() {
    const imageUrl = getDonationImageUrl(this.getToken());
    this.setState({
      imageUrl: imageUrl,
      imageLoadingState: LOADING_STATE.IN_PROGRESS,
    });
    this.loadImage(imageUrl);
  }

  getSoundVolume() {
    return (this.state.soundVolume / (Constants.MAX_VOLUME + 0.01));
  }

  getSpeechVolume() {
    return (this.state.speechVolume / (Constants.MAX_VOLUME + 0.01));
  }

  onConnectionEstablished() {
    if (this.isTestMode()) {
      window.parent.postMessage('addTestDonation', '*');
    }
    DonationAlertSettingsActions.requestDonationAlertSettingsByToken.defer(this.getToken());
  }

  onMessage(message) {
    this.addDonationToQueue(message);
  }

  onSettingsReload() {
    DonationAlertSettingsActions.requestDonationAlertSettingsByToken.defer(this.getToken());
    this.reloadImage();
  }

  getClientType() {
    return 'donationAlert';
  }

  endDonation() {
    this.setState({
      activeDonation: null,
      preparedDonation: null
    });
    if (this.isTestMode()) {
      window.parent.postMessage('donationEnded', '*');
    }
    this.createProcessDonationsTimer(Constants.DONATION_PROCESSING_INTERVAL_SEC);
  }

  onAnimationEnd() {
    if (this.state.playingEndAnimation) {
      this.setState({
        playingEndAnimation: false,
      });
      this.endDonation();
    }
  }
  
  processDonations() {
    const {activeDonation, imageLoadingState} = this.state;
    if (activeDonation !== null) {
      if (!this.state.endAnimation) {
        this.endDonation();
      } else {
        this.setState({playingEndAnimation: true});
      }
      return;
    }
    if (this.donationQueue.length === 0) {
      this.createProcessDonationsTimer(Constants.DONATION_PROCESSING_INTERVAL_SEC);
    } else {
      // has donation in queue
      if (imageLoadingState !== LOADING_STATE.IN_PROGRESS) {
        this.playNextDonation();
      } else {
        this.createProcessDonationsTimer(Constants.DONATION_PROCESSING_INTERVAL_SEC);
      }
    }
  }

  addDonationToQueue(donation) {
    const donationObj = JSON.parse(donation);
    this.donationQueue.push(donationObj);
  }

  playNextDonation() {
    const donation = this.donationQueue.shift();

    if (!canPlayAudio()) {
      console.error('Unable to play any audio format!');
      this.showDonation(donation);
      this.createProcessDonationsTimer(Constants.DONATION_DISAPPEAR_ON_ERROR_DELAY_SEC);
      return;
    }

    this.setState({
      preparedDonation: donation
    });

    const format = getSupportedAudioFormat();
    const token = this.getToken();
    const donationId = donation.id;
    const donationSpeechUrl = getDonationSpeechUrl(donationId, format, token);
    this.playDonationSounds(donationSpeechUrl, donation);
  }

  getDonationAudio() {
    return document.getElementById('donationAudio');
  }

  getSpeechAudio() {
    return document.getElementById('speechAudio');
  }

  initDonationAudio() {
    const loadSpeechFunction = () => {
      const speechAudio = this.getSpeechAudio();
      speechAudio.volume = this.getSpeechVolume();
      speechAudio.src = this.state.donationSpeechUrl;
      this.setState({donationSpeechLoadingState: LOADING_STATE.IN_PROGRESS});
      speechAudio.load();
    };

    const donationAudio = this.getDonationAudio();
    donationAudio.addEventListener('ended', this.onDonationAudioEnded.bind(this));
    donationAudio.addEventListener('loadeddata', () => {
      this.setState({donationSoundLoadingState: LOADING_STATE.LOADED}, loadSpeechFunction);
    });
    donationAudio.addEventListener('error', () => {
      console.error('Unable to load donationAudio sound, error code: ' + donationAudio.error.code);
      this.setState({donationSoundLoadingState: LOADING_STATE.ERROR}, loadSpeechFunction);
    });
  }

  onDonationAudioEnded() {
    const speechAudio = this.getSpeechAudio();
    if (this.state.donationSpeechLoadingState === LOADING_STATE.LOADED) {
      speechAudio.play();
    } else {
      this.createProcessDonationsTimer(Constants.DONATION_DISAPPEAR_ON_ERROR_DELAY_SEC);
    }
  }

  showPreparedDonation() {
    this.showDonation(this.state.preparedDonation);
  }

  showDonation(donation) {
    this.setState({
      activeDonation: donation,
      showedAnyDonations: true
    });
  }

  initDonationSpeech() {
    const speechAudio = this.getSpeechAudio();
    speechAudio.addEventListener('ended', () => {
      this.createProcessDonationsTimer(Constants.DONATION_DISAPPEAR_DELAY_SEC);
    });
    const donationAudio = this.getDonationAudio();
    speechAudio.addEventListener('loadeddata', () => {
      this.setState({donationSpeechLoadingState: LOADING_STATE.LOADED});
      this.showPreparedDonation();
      if (this.state.donationSoundLoadingState === LOADING_STATE.LOADED) {
        donationAudio.play();
      } else {
        speechAudio.play();
      }
    });
    speechAudio.addEventListener('error', () => {
      console.error('Unable to load speechAudio sound, error code: ' + speechAudio.error.code);
      this.setState({donationSpeechLoadingState: LOADING_STATE.ERROR});
      this.showPreparedDonation();
      if (this.state.donationSoundLoadingState === LOADING_STATE.LOADED) {
        // we still can play donation sound
        donationAudio.play();
      } else {
        this.createProcessDonationsTimer(Constants.DONATION_DISAPPEAR_ON_ERROR_DELAY_SEC);
      }
    });
  }

  playDonationSounds(donationSpeechUrl) {
    const loadDonationAudio = () => {
      const donationAudio = this.getDonationAudio();
      donationAudio.volume = this.getSoundVolume();
      donationAudio.src = this.state.donationSoundUrl;
      donationAudio.load();
    };
    this.setState({
      donationSpeechUrl: donationSpeechUrl,
      donationSoundLoadingState: LOADING_STATE.IN_PROGRESS
    }, loadDonationAudio);
  }

  renderWidgetRemark() {
    return (
        <div className="b-donation-widget__remark">
          <div className="b-donation-widget-remark">
            {localizeString('DONATION_WIDGET.REMARK')}
          </div>
        </div>
    );
  }

  getDonationMock() {
    return {
      sum: 1,
      sender: '',
      message: '',
      signature: DONATION_SIGNATURE.NONE
    };
  }

  render() {
    const imageUrl = (this.state.imageLoadingState !== LOADING_STATE.ERROR)
        ? `url(${this.state.imageUrl})` : 'none';
    const donationPictureBoundingBoxImage = {
      backgroundImage: imageUrl
    };
    const {activeDonation, showedAnyDonations, startAnimation, endAnimation, playingEndAnimation,
        titleFontSettings, textFontSettings} = this.state;
    const showStartAnimation = startAnimation !== null && activeDonation !== null && !playingEndAnimation;
    const showEndAnimation = playingEndAnimation;
    const donationWidgetClasses = classNames({
      'b-donation-widget': true,
      // donation is hidden instead of not displaying to guarantee preliminary image loading
      'b-donation-widget--hidden': activeDonation === null,
      'animated': (showStartAnimation || showEndAnimation),
      [startAnimation]: showStartAnimation,
      [endAnimation]: showEndAnimation
    });
    const activeDonationNotNull = (activeDonation !== null) ? activeDonation : this.getDonationMock();
    const donationMetaText = this.getDonationMeta(activeDonationNotNull);
    const donationMeta = (
        <StyledText text={donationMetaText} fontSettings={titleFontSettings}
                    replaceTwitchChar={activeDonationNotNull.signature === DONATION_SIGNATURE.TWITCH}/>
    );
    const donationMetaStyle = {fontSize: titleFontSettings.fontSize};
    const donationMessage = <StyledText text={activeDonationNotNull.message} fontSettings={textFontSettings}/>;
    const donationWidget = (
        <div className="b-donation-widget-wrapper">
          <div className={donationWidgetClasses} onAnimationEnd={this.onAnimationEnd}>
            <div className="b-donation-picture">
              <div className="b-donation-picture__bounding-box" style={donationPictureBoundingBoxImage}></div>
            </div>
            <div className="b-donation-widget__meta" style={donationMetaStyle}>
              <div className="b-donation-widget-meta">
                {donationMeta}
              </div>
            </div>
            <div className="b-donation-widget__message">
              <div className="b-donation-widget-message">
                {donationMessage}
              </div>
            </div>
          </div>
        </div>
    );
    const donationWidgetRemark = (activeDonation === null && !showedAnyDonations) ? this.renderWidgetRemark() : null;
    return (
        <div className="b-donation-widget-wrapper">
          <div className="b-donation-widget-audio-elements">
            <audio id="donationAudio" type={getSupportedAudioMimeType()}></audio>
            <audio id="speechAudio" type={getSupportedAudioMimeType()}></audio>
          </div>
          {donationWidget}
          {donationWidgetRemark}
        </div>
    );
  }
}
