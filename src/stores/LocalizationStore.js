import alt from '../alt';

import LocalizationActions from '../actions/LocalizationActions';
import {LOCALE} from '../localization/Locales';

const LOCALES = Object.keys(LOCALE).map((key) => LOCALE[key]);

class LocalizationStore {

  constructor() {
    this.bindActions(LocalizationActions);
    Object.assign(this, this.getInitialState());
  }

  getInitialState() {
    return ({
      locale: LOCALE.RU
    });
  }
  
  onSetLocale(locale) {
    this.setState({locale});
  }

  onSwitchLocale() {
    const currentLocale = this.locale;
    const currentLocaleIndex = (LOCALES.findIndex((locale) => locale === currentLocale));
    const nextLocale = LOCALES[(currentLocaleIndex + 1) % LOCALES.length];
    this.setState({locale: nextLocale});
  }
}

export default alt.createStore(LocalizationStore, 'LocalizationStore');
