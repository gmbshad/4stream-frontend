import alt from '../alt';

class DonationAlertSettingsActions {

  requestDonationAlertSettings() {
    return true;
  }

  requestDonationAlertSettingsByToken(token) {
    return token;
  }

  receiveDonationAlertSettings(settings) {
    return settings;
  }

  receiveDonationAlertSettingsError(error) {
    return error;
  }

  requestDonationAlertSettingsUpdate(settings) {
    return settings;
  }

  receiveDonationAlertSettingsUpdate(settings) {
    return settings;
  }

  receiveDonationAlertSettingsUpdateError(error) {
    return error;
  }
}

export default alt.createActions(DonationAlertSettingsActions);
