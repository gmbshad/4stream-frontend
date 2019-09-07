import React from 'react';
import AltContainer from 'alt-container';

import DashboardCategories from './DashboardCategories';
import AuthStore from '../../stores/AuthStore';
import DashboardWidgetsAlerts from './DashboardWidgetsAlerts';
import DashboardWidgetsDonationGoal from './DashboardWidgetsDonationGoal';
import {WIDGETS_CATEGORY} from '../../utils/Constants';
import {localizeString} from '../../localization/LocalizationUtils';
import {getLastRoute} from '../../utils/NavigationUtils';

class DashboardWidgets extends DashboardCategories {

  getHeader() {
    return localizeString('DASHBOARD_WIDGETS.TITLE');
  }

  getRoute() {
    return '/dashboard/widgets/';
  }

  getDefaultCategory() {
    return WIDGETS_CATEGORY.ALERTS;
  }

  getCategories() {
    return [
      {
        name: WIDGETS_CATEGORY.ALERTS,
        text: localizeString('DASHBOARD_WIDGETS_ALERTS.SHORT_TITLE'),
        element: <DashboardWidgetsAlerts authStore={this.props.authStore}/>
      },
      {
        name: WIDGETS_CATEGORY.DONATION_GOAL,
        text: localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.SHORT_TITLE'),
        element: <DashboardWidgetsDonationGoal authStore={this.props.authStore}/>
      }
    ];
  }
}

DashboardWidgets.propTypes = {
  authStore: React.PropTypes.shape({
    userName: React.PropTypes.string, // NULLNU
    token: React.PropTypes.string     // NULLNU
  }),
  category: React.PropTypes.node
};

export default class DashboardWidgetsContainer extends React.Component {
  render() {
    const lastRoute = getLastRoute(this);
    return (
        <AltContainer stores={{authStore: AuthStore}}
                      inject={{category: lastRoute.path}}
        >
          <DashboardWidgets/>
        </AltContainer>
    );
  }
}

DashboardWidgetsContainer.propTypes = {
  routes: React.PropTypes.arrayOf(React.PropTypes.shape({
    path: React.PropTypes.string.isRequired
  }))
};
