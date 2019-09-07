import alt from '../alt';
import {NotificationManager} from 'react-notifications';

import {fetchGet, fetchPost, fetchPut, fetchDelete} from '../api/FetchUtils';
import DonationGoalActions from '../actions/DonationGoalActions';
import Constants from '../utils/Constants';
import {PROMISE_OK} from '../utils/Constants';
import {localizeString} from '../localization/LocalizationUtils';


class DonationGoalStore {

  getInitialTextFontSetting() {
    return {
      fontFamily: Constants.DEFAULT_FONT,
      fontSize: Constants.DONATION_GOAL_DEFAULT_TEXT_FONT_SIZE,
      fontColor: Constants.DONATION_GOAL_DEFAULT_TEXT_COLOR,
      shadowSize: Constants.DONATION_GOAL_DEFAULT_SHADOW_SIZE,
      shadowColor: Constants.DONATION_GOAL_DEFAULT_SHADOW_COLOR,
      backgroundColor: Constants.DONATION_GOAL_DEFAULT_BACKGROUND_COLOR,
      backgroundOpacity: Constants.DONATION_GOAL_DEFAULT_BACKGROUND_OPACITY,
      animation: null
    };
  }

  getInitialBarTextFontSetting() {
    return {
      fontFamily: Constants.DEFAULT_FONT,
      fontSize: Constants.DONATION_GOAL_DEFAULT_BAR_TEXT_FONT_SIZE,
      fontColor: Constants.DONATION_GOAL_DEFAULT_BAR_TEXT_COLOR,
      shadowSize: Constants.DONATION_GOAL_DEFAULT_SHADOW_SIZE,
      shadowColor: Constants.DONATION_GOAL_DEFAULT_SHADOW_COLOR,
      backgroundColor: Constants.DONATION_GOAL_DEFAULT_BACKGROUND_COLOR,
      backgroundOpacity: Constants.DONATION_GOAL_DEFAULT_BACKGROUND_OPACITY,
      animation: null
    };
  }

  getInitialGoalSettings() {
    return {
      activeDonationGoalId: null,
      barColor: Constants.DONATION_GOAL_DEFAULT_BAR_COLOR,
      barBackgroundColor: Constants.DONATION_GOAL_DEFAULT_BAR_BACKGROUND_COLOR,
      barThickness: Constants.DONATION_GOAL_DEFAULT_BAR_THICKNESS,
      titleFontSettings: this.getInitialTextFontSetting(),
      barTextFontSettings: this.getInitialBarTextFontSetting(),
      remainingFontSettings: this.getInitialTextFontSetting(),
      totalFontSettings: this.getInitialTextFontSetting()
    };
  }

  getInitialState() {
    return {
      donationGoalSettings: this.getInitialGoalSettings(),
      donationGoals: []
    };
  }

  resetDonationGoalSettings() {
    this.setState({
      donationGoalSettings: this.getInitialGoalSettings()
    });
  }
  
  constructor() {
    this.bindActions(DonationGoalActions);
    Object.assign(this, this.getInitialState());
  }

  isDonationGoalSettingsJsonValid(json) {
    return json.activeDonationGoalId !== undefined &&
        json.barColor !== undefined &&
        json.barBackgroundColor !== undefined &&
        json.barThickness !== undefined &&
        json.titleFontSettings !== undefined &&
        json.barTextFontSettings !== undefined &&
        json.remainingFontSettings !== undefined &&
        json.totalFontSettings !== undefined;
  }

  onRequestDonationGoalSettings() {
    const url = Constants.DONATION_GOAL_API_URL_SETTINGS;
    fetchGet(url)
        .then((response) => response.json())
        .then((json) => {
          if (!this.isDonationGoalSettingsJsonValid(json)) {
            throw Error('Response JSON is not valid: ' + JSON.stringify(json));
          }
          DonationGoalActions.receiveDonationGoalSettings(json);
        })
        .catch(function(error) {
          DonationGoalActions.receiveDonationGoalSettingsError(error);
        });
  }

  onReceiveDonationGoalSettings(donationGoalSettings) {
    this.setState({
      donationGoalSettings
    });
  }

  onReceiveDonationGoalSettingsError(error) {
    console.error('DONATION_GOAL_API_URL_SETTINGS failed:', error);
    this.resetDonationGoalSettings();
  }

  onRequestDonationGoalSettingsUpdate(donationGoalSettings) {
    const url = Constants.DONATION_GOAL_API_URL_SETTINGS;
    fetchPost(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(donationGoalSettings)
    })
        .then((response) => {
          if (response.ok !== true) {
            return response.text();
          }
          DonationGoalActions.receiveDonationGoalSettingsUpdate(donationGoalSettings);
          return Promise.resolve(PROMISE_OK);
        })
        .then(result => {
          if (result !== PROMISE_OK) {
            throw Error(result);
          }
        })
        .catch(function(error) {
          DonationGoalActions.receiveDonationGoalSettingsUpdateError(error);
        });
  }

  onReceiveDonationGoalSettingsUpdate(donationGoalSettings) {
    const updatedSettings = Object.assign({}, this.donationGoalSettings || {}, donationGoalSettings);
    this.setState({
      donationGoalSettings: updatedSettings
    });
    // no notification when just activeDonationGoalId is updated
    const onlyActiveGoalUpdate = donationGoalSettings.hasOwnProperty('activeDonationGoalId') &&
        Object.keys(donationGoalSettings).length === 1;
    if (!onlyActiveGoalUpdate) {
      const title = localizeString('NOTIFICATIONS.SAVE_SETTINGS.TITLE');
      const text = localizeString('NOTIFICATIONS.SAVE_SETTINGS.SUCCESS');
      NotificationManager.success(text, title);
    }
  }

  onReceiveDonationGoalSettingsUpdateError(error) {
    this.resetDonationGoalSettings();
    const title = localizeString('NOTIFICATIONS.SAVE_SETTINGS.TITLE');
    const text = localizeString('NOTIFICATIONS.SAVE_SETTINGS.ERROR');
    NotificationManager.error(text, title);
    console.error(error);
  }

  onRequestDonationGoals() {
    fetchGet(Constants.DONATION_GOAL_API_URL_DONATION_GOALS)
        .then((response) => response.json())
        .then((json) => {
          if (json.donationGoals === undefined) {
            throw Error('Response JSON is not valid: ' + JSON.stringify(json));
          }
          DonationGoalActions.receiveDonationGoals(json);
        })
        .catch(function(error) {
          DonationGoalActions.receiveDonationGoalsError(error);
        });
  }

  onReceiveDonationGoals(donationGoals) {
    this.setState(donationGoals);
  }

  onReceiveDonationGoalsError(error) {
    console.error('DONATION_GOAL_API_URL_DONATION_GOALS failed:', error);
    this.setState({donationGoals: []});
  }

  onRequestDonationGoalCreation(donationGoal) {
    const url = Constants.DONATION_GOAL_API_URL_DONATION_GOAL;
    fetchPost(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(donationGoal)
    })
        .then((response) => {
          if (response.ok !== true) {
            return response.text();
          }
          DonationGoalActions.receiveDonationGoalCreation();
          return Promise.resolve(PROMISE_OK);
        })
        .then(result => {
          if (result !== PROMISE_OK) {
            throw Error(result);
          }
        })
        .catch(function(error) {
          DonationGoalActions.receiveDonationGoalCreationError(error);
        });
  }

  onReceiveDonationGoalCreation() {
    const title = localizeString('NOTIFICATIONS.DONATION_GOAL_CREATION.TITLE');
    const text = localizeString('NOTIFICATIONS.DONATION_GOAL_CREATION.SUCCESS');
    NotificationManager.success(text, title);
  }

  onReceiveDonationGoalCreationError(error) {
    console.error(error);
    const title = localizeString('NOTIFICATIONS.DONATION_GOAL_CREATION.TITLE');
    const text = localizeString('NOTIFICATIONS.DONATION_GOAL_CREATION.ERROR');
    NotificationManager.error(text, title);
  }

  onRequestDonationGoalUpdate({donationGoalId, donationGoal}) {
    const url = Constants.DONATION_GOAL_API_URL_DONATION_GOAL + `/${donationGoalId}`;
    fetchPut(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(donationGoal)
    })
        .then((response) => {
          if (response.ok !== true) {
            return response.text();
          }
          DonationGoalActions.receiveDonationGoalUpdate();
          return Promise.resolve(PROMISE_OK);
        })
        .then(result => {
          if (result !== PROMISE_OK) {
            throw Error(result);
          }
        })
        .catch(function(error) {
          DonationGoalActions.receiveDonationGoalUpdateError(error);
        });
  }

  onReceiveDonationGoalUpdate() {
    const title = localizeString('NOTIFICATIONS.DONATION_GOAL_UPDATE.TITLE');
    const text = localizeString('NOTIFICATIONS.DONATION_GOAL_UPDATE.SUCCESS');
    NotificationManager.success(text, title);
  }

  onReceiveDonationGoalUpdateError(error) {
    console.error(error);
    const title = localizeString('NOTIFICATIONS.DONATION_GOAL_UPDATE.TITLE');
    const text = localizeString('NOTIFICATIONS.DONATION_GOAL_UPDATE.ERROR');
    NotificationManager.error(text, title);
  }

  onRequestDonationGoalDelete(donationGoalId) {
    const url = Constants.DONATION_GOAL_API_URL_DONATION_GOAL + `/${donationGoalId}`;
    fetchDelete(url)
        .then((response) => {
          if (response.ok !== true) {
            return response.text();
          }
          DonationGoalActions.receiveDonationGoalDelete();
          return Promise.resolve(PROMISE_OK);
        })
        .then(result => {
          if (result !== PROMISE_OK) {
            throw Error(result);
          }
        })
        .catch(function(error) {
          DonationGoalActions.receiveDonationGoalDeleteError(error);
        });
  }

  onReceiveDonationGoalDelete() {
    const title = localizeString('NOTIFICATIONS.DONATION_GOAL_DELETE.TITLE');
    const text = localizeString('NOTIFICATIONS.DONATION_GOAL_DELETE.SUCCESS');
    NotificationManager.success(text, title);
  }

  onReceiveDonationGoalDeleteError(error) {
    console.error(error);
    const title = localizeString('NOTIFICATIONS.DONATION_GOAL_DELETE.TITLE');
    const text = localizeString('NOTIFICATIONS.DONATION_GOAL_DELETE.ERROR');
    NotificationManager.error(text, title);
  }

  onRequestWidgetData(token) {
    const url = `${Constants.DONATION_GOAL_API_URL_WIDGET_DATA}?token=${token}`;
    fetchGet(url)
        .then((response) => response.json())
        .then((json) => {
          if (json.settings === undefined || json.activeDonationGoal === undefined) {
            throw Error('Response JSON is not valid: ' + JSON.stringify(json));
          }
          DonationGoalActions.receiveWidgetData(json);
        })
        .catch(function(error) {
          DonationGoalActions.receiveWidgetDataError(error);
        });
  }
}

export default alt.createStore(DonationGoalStore, 'DonationGoalStore');
