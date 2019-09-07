import alt from '../alt';
import {NotificationManager} from 'react-notifications';

import {fetchGet, fetchPost} from '../api/FetchUtils';
import SettingsActions from '../actions/SettingsActions';
import Constants from '../utils/Constants';
import {PROMISE_OK, TTS_VOICE} from '../utils/Constants';
import {localizeString} from '../localization/LocalizationUtils';


class SettingsStore {

  resetSettings() {
    this.mergeSettings(this.getInitialSettings());
  }
  
  mergeSettings(settings) {
    this.setState(settings);
  }
  
  getInitialSettings() {
    return {
      settingsInitialized: false,
      speechEnabled: true,
      ttsVoice: TTS_VOICE.MAXIM,
      minDonationAmount: Constants.DEFAULT_MIN_DONATION_AMOUNT,
      minAmountForSynthesis: Constants.DEFAULT_MIN_AMOUNT_FOR_SYNTHESIS,
      webmoneyWallet: null,
      yandexWallet: null,
      qiwiWallet: null,
      timeZone: null,
      donationPageText: null,
      showTwitchStreamStatus: true,
      notifyTwitchChatDonations: true,
      readDonationMeta: true
    };
  }
  
  constructor() {
    this.bindActions(SettingsActions);
    Object.assign(this, this.getInitialSettings());
  }

  isSettingsJsonValid(json) {
    return json.speechEnabled !== undefined &&
        (Object.keys(TTS_VOICE).find(key => TTS_VOICE[key] === json.ttsVoice) !== undefined) &&
        json.minAmountForSynthesis !== undefined &&
        json.minDonationAmount !== undefined &&
        json.webmoneyWallet !== undefined &&
        json.yandexWallet !== undefined && 
        json.qiwiWallet !== undefined &&
        json.timeZone !== undefined &&
        json.donationPageText !== undefined &&
        json.showTwitchStreamStatus !== undefined &&
        json.readDonationMeta !== undefined;
  }

  onRequestSettings() {
    this.requestSettingsInternal(Constants.SETTINGS_API_URL_USER_SETTINGS);
  }

  requestSettingsInternal(url) {
    fetchGet(url)
        .then((response) => response.json())
        .then((json) => {
          if (!this.isSettingsJsonValid(json)) {
            throw Error('Response JSON is not valid: ' + JSON.stringify(json));
          }
          SettingsActions.receiveSettings(json);
        })
        .catch(function(error) {
          SettingsActions.receiveSettingsError(error);
        });
  }

  onReceiveSettings(settings) {
    this.mergeSettings(Object.assign({settingsInitialized: true}, settings));
  }
  
  onReceiveSettingsError(error) {
    console.error('SETTINGS_API_URL_USER_SETTINGS failed:', error);
    this.resetSettings();
  }
  
  onRequestSettingsUpdate(settings) {
    fetchPost(Constants.SETTINGS_API_URL_USER_SETTINGS, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    })
        .then((response) => {
          if (response.ok !== true) {
            return response.text();
          }
          SettingsActions.receiveSettingsUpdate(settings);
          return Promise.resolve(PROMISE_OK);
        })
        .then(result => {
          if (result !== PROMISE_OK) {
            throw Error(result);
          }
        })
        .catch(function(error) {
          SettingsActions.receiveSettingsUpdateError(error);
        });
  }
  
  onReceiveSettingsUpdate(settings) {
    const title = localizeString('NOTIFICATIONS.SAVE_SETTINGS.TITLE');
    const text = localizeString('NOTIFICATIONS.SAVE_SETTINGS.SUCCESS');
    NotificationManager.success(text, title);
    this.mergeSettings(settings);
  }
  
  onReceiveSettingsUpdateError(error) {
    const title = localizeString('NOTIFICATIONS.SAVE_SETTINGS.TITLE');
    const text = localizeString('NOTIFICATIONS.SAVE_SETTINGS.ERROR');
    NotificationManager.error(text, title);
    console.error(error);
  }
}

export default alt.createStore(SettingsStore, 'SettingsStore');
