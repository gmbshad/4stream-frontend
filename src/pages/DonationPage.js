/*eslint no-unused-vars: [2, { "varsIgnorePattern": "NotificationStore" }]*/
import React from 'react';
import classNames from 'classnames';
import {sprintf} from 'sprintf-js';

import BasePage from '../layout/BasePage';
import DonationForm from '../components/DonationForm';
import ResourceNotFound from '../components/ResourceNotFound';
import NotificationStore from '../stores/NotificationStore';
import NotificationActions from '../actions/NotificationActions';
import {fetchGet} from '../api/FetchUtils';
import Constants from '../utils/Constants';
import {TTS_VOICE} from '../utils/Constants';
import {localizeString} from '../localization/LocalizationUtils';
import {lowercaseFirstLetter} from '../utils/StringUtils';
import {removeCookie, getCookie} from '../utils/CookieManager';

const TWITCH_STREAM_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline'
};

export default class DonationPage extends BasePage {

  componentWillMount() {
    // avoid double redirect
    removeCookie(Constants.COOKIE_REDIRECT);
    const messageId = getCookie(Constants.COOKIE_MESSAGE_ID);
    if (messageId === Constants.PAYMENT_SUCCESS_MESSAGE_ID ||
        messageId === Constants.PAYMENT_ERROR_MESSAGE_ID ||
        messageId === Constants.AUTH_ERROR_MESSAGE_ID) {
      removeCookie(Constants.COOKIE_MESSAGE_ID);
      NotificationActions.postMessage(messageId);
    }
    this.setState({
      userNotFound: false,
      recipientId: null,
      speechEnabled: true,
      ttsVoice: TTS_VOICE.MAXIM,
      minDonationAmount: Constants.DEFAULT_MIN_DONATION_AMOUNT,
      minAmountForSynthesis: Constants.DEFAULT_MIN_AMOUNT_FOR_SYNTHESIS,
      twitchData: null,
      showTwitchStreamStatus: false,
      donationPageText: null,
      donationWidgetActive: false,    
      acceptsWebmoney: false,
      acceptsYandexMoney: false,
      acceptsUnitPay: false
    });
    const recipientName = this.props.params.recipientName;
    fetchGet(Constants.USER_API_URL_INFO + recipientName)
        .then((response) => response.json())
        .then((json) => {
          const userId = json.userId !== undefined ? json.userId : null;
          const userName = json.userName !== undefined ? json.userName : null;
          this.setState({
            recipientId: userId,
            recipientName: userName,
            speechEnabled: json.speechEnabled,
            ttsVoice: json.ttsVoice,
            minDonationAmount: json.minDonationAmount,
            minAmountForSynthesis: json.minAmountForSynthesis,
            showTwitchStreamStatus: json.showTwitchStreamStatus,
            donationPageText: json.donationPageText,
            donationWidgetActive: json.donationWidgetActive,
            acceptsWebmoney: json.acceptsWebmoney,
            acceptsYandexMoney: json.acceptsYandexMoney,
            acceptsUnitPay: json.acceptsUnitPay
          });
          if (userName === null) {
            this.setState({userNotFound: true});
          } else if (json.showTwitchStreamStatus) {
            this.requestUserTwitchInformation();
          }
        });
  }

  requestUserTwitchInformation() {
    const recipientName = this.props.params.recipientName;
    // sending this header is mandatory, see https://github.com/justintv/Twitch-API/blob/master/README.md#rate-limits
    const requestData = {
      headers: {
        'Client-ID': Constants.TWITCH_APP_ID
      }
    };
    const channelsPromise = fetchGet(`${Constants.TWITCH_API_CHANNELS}${recipientName}`, requestData, true)
        .then(response => response.json());
    const streamsPromise = fetchGet(`${Constants.TWITCH_API_STREAMS}${recipientName}`, requestData, true)
        .then(response => response.json());

    Promise.all([channelsPromise, streamsPromise])
        .then(results => {
          const channel = results[0];
          const stream = results[1];
          if (this.twitchResponseValid(channel, stream)) {
            this.updateTwitchStreamStatus(channel, stream);
          } else {
            throw Error(`JSON is not valid. Channel: ${JSON.stringify(channel)}. Stream: ${JSON.stringify(stream)}`);
          }
        })
        .catch(error => {
          this.setState({
            twitchData: undefined
          });
          console.error(error);
        });
  }
  
  twitchStreamValid(stream) {
    return stream.game !== undefined && stream.viewers !== undefined;
  }

  twitchResponseValid(channel, stream) {
    const channelValid = channel.display_name !== undefined && channel.display_name !== null &&
        channel.logo !== undefined;
    const streamJson = stream.stream;
    const streamValid = streamJson !== undefined && (streamJson === null || this.twitchStreamValid(streamJson));
    return channelValid && streamValid;
  }

  updateTwitchStreamStatus(channel, stream) {
    const streamObj = stream.stream;
    const streamOnline = streamObj !== null;
    this.setState({
      twitchData: {
        twitchName: channel.display_name,
        twitchProfilePicture: channel.logo,
        twitchStreamStatus: streamOnline ? TWITCH_STREAM_STATUS.ONLINE : TWITCH_STREAM_STATUS.OFFLINE,
        twitchCurrentGame: streamOnline ? streamObj.game : null,
        twitchCurrentViewers: streamOnline ? streamObj.viewers : null
      }
    });
  }

  renderUserInfo() {
    if (this.state.showTwitchStreamStatus && this.state.twitchData !== undefined) {
      return this.renderTwitchStreamStatus();
    }
    return this.renderBasicUserInfo();
  }

  getDonationWidgetStatus() {
    const particle = this.state.donationWidgetActive ? '' : localizeString('DONATION_PAGE.WIDGET_STATUS_NEGATION');
    return sprintf(localizeString('DONATION_PAGE.WIDGET_STATUS'), particle);
  }

  renderTwitchStreamStatus() {
    const twitchData = this.state.twitchData;
    if (twitchData === null) {
      // it's not loaded yet
      return null;
    }

    const twitchProfilePicture = twitchData.twitchProfilePicture;
    const logoUrl = twitchProfilePicture !== null ? twitchProfilePicture : Constants.TWITCH_DEFAULT_USER_LOGO_URL;

    const streamStatusClassNames = classNames({
      'b-donation-page-user-stream-status-part': true,
      'b-donation-page-user-stream-status-part--online': twitchData.twitchStreamStatus === TWITCH_STREAM_STATUS.ONLINE
    });
    const donationWidgetStatus = lowercaseFirstLetter(this.getDonationWidgetStatus());
    const widgetStatusClassNames = classNames({
      'b-donation-page-user-stream-status-part': true,
      'b-donation-page-user-stream-status-part--online': 
          !donationWidgetStatus.includes(localizeString('DONATION_PAGE.WIDGET_STATUS_NEGATION'))
    });
    let currentStreamDescription = '';
    if (twitchData.twitchCurrentGame !== null && twitchData.twitchCurrentGame !== '') {
      currentStreamDescription += sprintf(localizeString('DONATION_PAGE.CURRENT_GAME'), twitchData.twitchCurrentGame);
    }
    if (twitchData.twitchCurrentViewers > 0) {
      currentStreamDescription +=
          sprintf(localizeString('DONATION_PAGE.CURRENT_VIEWERS'), twitchData.twitchCurrentViewers);
    }
    const streamStatus = twitchData.twitchStreamStatus;
    return (
        <div className="b-donation-page-user-info">
          <div className="b-donation-page-logo-container">
            <img className="b-donation-page-logo" src={logoUrl}/>
          </div>
          <div className="b-donation-page-user-twitch-name">
            {twitchData.twitchName}
          </div>
          <div className="b-donation-page-user-stream-status">
            <div className={streamStatusClassNames}>
              {streamStatus},&nbsp;
            </div>
            <div className={widgetStatusClassNames}>
              {donationWidgetStatus}
            </div>
          </div>
          <div className="b-donation-page-stream-description">
            {currentStreamDescription}
          </div>
        </div>
    );
  }

  renderBasicUserInfo() {
    if (this.state.recipientId === null) {
      return null;
    }
    const donationWidgetStatus = this.getDonationWidgetStatus();
    const widgetStatusClassNames = classNames({
      'b-donation-page-user-stream-status-part': true,
      'b-donation-page-user-stream-status-part--online':
          !donationWidgetStatus.includes(localizeString('DONATION_PAGE.WIDGET_STATUS_NEGATION'))
    });
    return (
      <div className="b-donation-page-user-info">
        <div className="b-donation-page-user-name">
          {this.state.recipientName}
        </div>
        <div className="b-donation-page-widget-status">
          <div className={widgetStatusClassNames}>
            {donationWidgetStatus}
          </div>
        </div>
      </div>
    );
  }

  renderDonationPageText() {
    const text = this.state.donationPageText ? this.state.donationPageText : '';
    return (
      <div className="b-donation-page-custom-text">
        {text}
      </div>  
    );
  }

  renderUserNotFound() {
    return (
        <div className="b-donation-page b-donation-page--max-height">
          <ResourceNotFound text={localizeString('DONATION_PAGE.USER_NOT_FOUND')}/>
        </div>
    );
  }

  displayNoHeader() {
    return true;
  }

  renderContent() {
    const {recipientName, recipientId, userNotFound, ttsVoice} = this.state;
    if (userNotFound) {
      return this.renderUserNotFound();
    } else if (recipientId === null) {
      return null;
    }

    const donationLimits = {
      speechEnabled: this.state.speechEnabled,
      ttsVoice: ttsVoice,
      minDonationAmount: this.state.minDonationAmount,
      minAmountForSynthesis: this.state.minAmountForSynthesis
    };
    const paymentMethods = {
      webmoney: this.state.acceptsWebmoney,
      yandex: this.state.acceptsYandexMoney,
      unitPay: this.state.acceptsUnitPay
    };
    const ttsPreview = (ttsVoice === TTS_VOICE.ALEKSANDR);
    const stressSupport = (ttsVoice === TTS_VOICE.ALEKSANDR);
    return (
        <div className="b-donation-page">
          <div className="b-donation-page__user-info">
            {this.renderUserInfo()}
          </div>
          <div className="b-donation-page__custom-text">
            {this.renderDonationPageText()}
          </div>
          <DonationForm recipientId={recipientId} recipientName={recipientName} paymentMethods={paymentMethods} 
                        donationLimits={donationLimits} ttsPreview={ttsPreview} stressSupport={stressSupport}/>
        </div>
    );
  }
}

DonationPage.propTypes = {
  params: React.PropTypes.shape({
    recipientName: React.PropTypes.string.isRequired
  })
};

