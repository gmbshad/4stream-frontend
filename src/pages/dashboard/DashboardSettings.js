import React from 'react';
import AltContainer from 'alt-container';

import AuthStore from '../../stores/AuthStore';
import DashboardSettingsGeneral from './DashboardSettingsGeneral';
import DashboardSettingsPayments from './DashboardSettingsPayments';
import DashboardSettingsDonationPage from './DashboardSettingsDonationPage';
import {SETTINGS_CATEGORY} from '../../utils/Constants';
import {getLastRoute} from '../../utils/NavigationUtils';
import {localizeString} from '../../localization/LocalizationUtils';
import DashboardCategories from './DashboardCategories';

class DashboardSettings extends DashboardCategories {

  getHeader() {
    return localizeString('DASHBOARD_SETTINGS.TITLE');
  }

  getRoute() {
    return '/dashboard/settings/';
  }

  getDefaultCategory() {
    return SETTINGS_CATEGORY.GENERAL;
  }

  getCategories() {
    return [
      {
        name: SETTINGS_CATEGORY.GENERAL,
        text: localizeString('DASHBOARD_SETTINGS_GENERAL.SHORT_TITLE'),
        element: <DashboardSettingsGeneral/>
      },
      {
        name: SETTINGS_CATEGORY.PAYMENTS,
        text: localizeString('DASHBOARD_SETTINGS_PAYMENTS.SHORT_TITLE'),
        element: <DashboardSettingsPayments/>
      },
      {
        name: SETTINGS_CATEGORY.DONATION_PAGE,
        text: localizeString('DASHBOARD_SETTINGS_DONATION_PAGE.SHORT_TITLE'),
        element: <DashboardSettingsDonationPage authStore={this.props.authStore}/>
      },
    ];
  }
}

DashboardSettings.propTypes = Object.assign({}, DashboardCategories.propTypes, {
  authStore: React.PropTypes.shape({
    userName: React.PropTypes.string, // NULLNU
    token: React.PropTypes.string     // NULLNU
  })
});

export default class DashboardSettingsContainer extends React.Component {
  render() {
    const lastRoute = getLastRoute(this);
    return (
        <AltContainer stores={{authStore: AuthStore}}
                      inject={{category: lastRoute.path}}
        >
          <DashboardSettings/>
        </AltContainer>
    );
  }
}

DashboardSettingsContainer.propTypes = {
  routes: React.PropTypes.arrayOf(React.PropTypes.shape({
    path: React.PropTypes.string.isRequired
  }))
};
