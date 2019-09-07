import alt from '../alt';
import {NotificationManager} from 'react-notifications';

import {fetchGet, fetchPost} from '../api/FetchUtils';
import DonationAlertSettingsActions from '../actions/DonationAlertSettingsActions';
import Constants from '../utils/Constants';
import {PROMISE_OK} from '../utils/Constants';
import {localizeString} from '../localization/LocalizationUtils';


class DonationAlertSettingsStore {

  resetSettings() {
    this.mergeSettings(this.getInitialSettings());
  }
  
  mergeSettings(settings) {
    this.setState(settings);
  }
  
  getInitialSettings() {
    return {
      soundVolume: Constants.DEFAULT_VOLUME,
      speechVolume: Constants.DEFAULT_VOLUME,
      donationTitleTemplate: Constants.DONATION_TITLE_TEMPLATE_DEFAULT,
      startAnimation: null,
      endAnimation: null,
      titleFontSettings: {
        fontFamily: Constants.DEFAULT_FONT,
        fontSize: Constants.DONATION_TITLE_DEFAULT_FONT_SIZE,
        fontColor: Constants.DONATION_TITLE_DEFAULT_FONT_COLOR,
        shadowSize: Constants.DONATION_TITLE_DEFAULT_SHADOW_SIZE,
        shadowColor: Constants.DONATION_TITLE_DEFAULT_SHADOW_COLOR,
        backgroundColor: Constants.DONATION_TITLE_DEFAULT_BACKGROUND_COLOR,
        backgroundOpacity: Constants.DONATION_TITLE_DEFAULT_BACKGROUND_OPACITY,
        animation: null
      },
      textFontSettings: {
        fontFamily: Constants.DEFAULT_FONT,
        fontSize: Constants.DONATION_TEXT_DEFAULT_FONT_SIZE,
        fontColor: Constants.DONATION_TEXT_DEFAULT_FONT_COLOR,
        shadowSize: Constants.DONATION_TEXT_DEFAULT_SHADOW_SIZE,
        shadowColor: Constants.DONATION_TEXT_DEFAULT_SHADOW_COLOR,
        backgroundColor: Constants.DONATION_TEXT_DEFAULT_BACKGROUND_COLOR,
        backgroundOpacity: Constants.DONATION_TEXT_DEFAULT_BACKGROUND_OPACITY,
        animation: null
      },
    };
  }
  
  constructor() {
    this.bindActions(DonationAlertSettingsActions);
    Object.assign(this, this.getInitialSettings());
  }

  isSettingsJsonValid(json) {
    return json.soundVolume !== undefined &&
        json.speechVolume !== undefined &&
        json.donationTitleTemplate !== undefined &&
        json.startAnimation !== undefined &&
        json.endAnimation !== undefined;
  }

  onRequestDonationAlertSettingsByToken(token) {
    const url = Constants.SETTINGS_API_URL_DONATION_ALERT_SETTINGS_BY_TOKEN + '?token=' + token;
    this.requestSettingsInternal(url);
  }

  onRequestDonationAlertSettings() {
    this.requestSettingsInternal(Constants.SETTINGS_API_URL_DONATION_ALERT_SETTINGS);
  }

  requestSettingsInternal(url) {
    fetchGet(url)
        .then((response) => response.json())
        .then((json) => {
          if (!this.isSettingsJsonValid(json)) {
            throw Error('Response JSON is not valid: ' + JSON.stringify(json));
          }
          DonationAlertSettingsActions.receiveDonationAlertSettings(json);
        })
        .catch(function(error) {
          DonationAlertSettingsActions.receiveDonationAlertSettingsError(error);
        });
  }

  onReceiveDonationAlertSettings(settings) {
    this.mergeSettings(Object.assign({}, settings));
  }
  
  onReceiveDonationAlertSettingsError(error) {
    console.error('SETTINGS_API_URL_DONATION_ALERT_SETTINGS failed:', error);
    this.resetSettings();
  }
  
  onRequestDonationAlertSettingsUpdate(settings) {
    fetchPost(Constants.SETTINGS_API_URL_DONATION_ALERT_SETTINGS, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    })
        .then((response) => {
          if (response.ok !== true) {
            return response.text();
          }
          DonationAlertSettingsActions.receiveDonationAlertSettingsUpdate(settings);
          return Promise.resolve(PROMISE_OK);
        })
        .then(result => {
          if (result !== PROMISE_OK) {
            throw Error(result);
          }
        })
        .catch(function(error) {
          DonationAlertSettingsActions.receiveDonationAlertSettingsUpdateError(error);
        });
  }
  
  onReceiveDonationAlertSettingsUpdate(settings) {
    const title = localizeString('NOTIFICATIONS.SAVE_SETTINGS.TITLE');
    const text = localizeString('NOTIFICATIONS.SAVE_SETTINGS.SUCCESS');
    NotificationManager.success(text, title);
    this.mergeSettings(settings);
  }
  
  onReceiveDonationAlertSettingsUpdateError(error) {
    const title = localizeString('NOTIFICATIONS.SAVE_SETTINGS.TITLE');
    const text = localizeString('NOTIFICATIONS.SAVE_SETTINGS.ERROR');
    NotificationManager.error(text, title);
    console.error(error);
  }
}

export default alt.createStore(DonationAlertSettingsStore, 'DonationAlertSettingsStore');
