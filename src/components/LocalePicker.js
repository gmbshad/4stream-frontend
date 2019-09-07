import React from 'react';
import classNames from 'classnames';

import {LOCALE} from '../localization/Locales';
import LocalizationActions from '../actions/LocalizationActions';
import LocalizationStore from '../stores/LocalizationStore';

export default class LocalePicker extends React.Component {
  render() {
    const {locale} = LocalizationStore.getState();
    const localeClassNames = classNames({
      'b-locale-picker-image': true,
      'b-locale-picker-image--ru': locale === LOCALE.RU,
      'b-locale-picker-image--en': locale === LOCALE.EN
    });
    return (
        <div className="b-locale-picker" onClick={LocalizationActions.switchLocale}>
          <div className={localeClassNames}>
          </div>  
        </div>
    );
  }
}
