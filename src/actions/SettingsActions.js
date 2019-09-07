import alt from '../alt';

class SettingsActions {

  requestSettings() {
    return true;
  }

  receiveSettings(settings) {
    return settings;
  }

  receiveSettingsError(error) {
    return error;
  }

  requestSettingsUpdate(settings) {
    return settings;
  }

  receiveSettingsUpdate(settings) {
    return settings;
  }

  receiveSettingsUpdateError(error) {
    return error;
  }
}

export default alt.createActions(SettingsActions);
