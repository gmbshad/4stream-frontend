import alt from '../alt';

class LocalizationActions {

  setLocale(locale) {
    return locale;
  }
  
  switchLocale() {
    return true;
  }
}

export default alt.createActions(LocalizationActions);
