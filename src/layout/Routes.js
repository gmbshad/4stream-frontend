import React from 'react';
import { Route } from 'react-router';

import App from './App';
import NotFoundPage from '../pages/NotFoundPage';
import DonationAlertWidget from '../pages/DonationAlertWidget';
import DonationGoalWidget from '../pages/DonationGoalWidget';
import DonationPage from '../pages/DonationPage';
import Dashboard from '../pages/dashboard/Dashboard';
import DashboardNews from '../pages/dashboard/DashboardNews';
import DashboardDonations from '../pages/dashboard/DashboardDonations';
import DashboardSettings from '../pages/dashboard/DashboardSettings';
import DashboardWidgets from '../pages/dashboard/DashboardWidgets';
import DashboardSupportService from '../pages/dashboard/DashboardSupportService';
import {SETTINGS_CATEGORY, WIDGETS_CATEGORY} from '../utils/Constants';
import Constants from '../utils/Constants';

export default (
  <Route path="/" component={App}>
    <Route path={`${Constants.DONATION_WIDGET_URL}`} component={DonationAlertWidget}/>
    <Route path={`${Constants.DONATION_GOAL_URL}`} component={DonationGoalWidget}/>
    <Route path="donate/:recipientName" component={DonationPage}/>
    <Route path="dashboard" component={Dashboard}>
      <Route path="news" components={{tab: DashboardNews}}/>
      <Route path="donations" components={{tab: DashboardDonations}}/>
      <Route path="settings" components={{tab: DashboardSettings}}>
        <Route path={`${SETTINGS_CATEGORY.GENERAL}`}/>
        <Route path={`${SETTINGS_CATEGORY.PAYMENTS}`}/>
        <Route path={`${SETTINGS_CATEGORY.DONATION_PAGE}`}/>
      </Route>
      <Route path="widgets" components={{tab: DashboardWidgets}}>
        <Route path={`${WIDGETS_CATEGORY.ALERTS}`}/>
        <Route path={`${WIDGETS_CATEGORY.DONATION_GOAL}`}/>
      </Route>
      <Route path="donate" components={{tab: DashboardSupportService}}/>
    </Route>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);
