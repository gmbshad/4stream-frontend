/*eslint no-unused-vars: [2, { "varsIgnorePattern": "DashboardStore" }]*/
import React from 'react';
import AltContainer from 'alt-container';
import classNames from 'classnames';

import BasePage from '../../layout/BasePage';
import Sidebar from '../../components/Sidebar';
import DashboardNews from './DashboardNews';
import {getDashboardLoginUrl} from '../../utils/Auth';
import {AUTH_STATE} from '../../stores/DashboardStore';
import DashboardStore from '../../stores/DashboardStore';
import {localizeString} from '../../localization/LocalizationUtils';
import Remark from '../../components/Remark';
import {navigateTo} from '../../utils/NavigationUtils';

class Dashboard extends BasePage {

  renderRemark() {
    // const {userAuthState, userDataReady} = this.props.dashboardStore;
    // const showRemark = (userAuthState === AUTH_STATE.AUTHENTICATED && userDataReady === true);
    // if (!showRemark) {
    //   return null;
    // }
    // const settingsStoreState = SettingsStore.getState();
    // const remarkRequired = (settingsStoreState.webmoneyWallet === null || settingsStoreState.yandexWallet === null ||
    //     settingsStoreState.qiwiWallet === null);
    // if (!remarkRequired) {
    //   return null;
    // }

    const remarkLines = [{
      text: localizeString('DONATION_WIDGET.REMARK'),
      center: true,
    }];
    // const remarkLines = [{
    //   text: localizeString('DASHBOARD.REMARK_GENERAL'),
    //   center: true
    // }];
    // let index = 1;
    // if (settingsStoreState.qiwiWallet === null) {
    //   remarkLines.push({
    //     text: sprintf(localizeString('DASHBOARD.REMARK_UNIT_PAY'), index++),
    //     indent: true
    //   });
    // }
    // if (settingsStoreState.yandexWallet === null) {
    //   remarkLines.push({
    //     text: sprintf(localizeString('DASHBOARD.REMARK_YANDEX'), index++),
    //     indent: true
    //   });
    // }
    // if (settingsStoreState.webmoneyWallet === null) {
    //   remarkLines.push({
    //     text: sprintf(localizeString('DASHBOARD.REMARK_WEBMONEY'), index++),
    //     indent: true
    //   });
    // }
    const onClick = () => navigateTo(`/dashboard/news`);
    return <Remark lines={remarkLines} onClick={onClick}/>;
  }

  renderContent() {
    const {userAuthState, userDataReady, isRequestsPerforming} = this.props.dashboardStore;
    let tab = null;
    if (userAuthState === AUTH_STATE.NOT_AUTHENTICATED) {
      const loginFunction = () => {
        this.refs.login.click();
      };
      tab = (
          <div className="b-dashboard-content-login">
            <a ref="login" className="b-dashboard-content-login-hidden" href={getDashboardLoginUrl()}/>
            <div className="b-dashboard-content-login-invitation">{localizeString('DASHBOARD.LOGIN_INVITATION_PART_1')}</div>
            <div className="b-dashboard-content-login-link" onClick={loginFunction}>{localizeString('DASHBOARD.LOGIN_INVITATION_PART_2')}</div>
            <div className="b-dashboard-content-login-invitation">{localizeString('DASHBOARD.LOGIN_INVITATION_PART_3')}</div>
          </div>
      );
    } else if (userDataReady) {
      tab = this.props.tab || <DashboardNews/>;
    }
    const hideLoader = (userDataReady && !isRequestsPerforming);
    const loaderWrapperClassNames = classNames({
      'b-dashboard-loader-wrapper': true,
      'b-dashboard-loader-wrapper--fade-out': hideLoader
    });
    return (
      <div className="b-dashboard">
        <div className="b-dashboard__header">
          <div className="b-dashboard-header">
            {localizeString('DASHBOARD.HEADER')}
          </div>
        </div>
        <div className="b-dashboard__loader">
          <div className={loaderWrapperClassNames}>
            <div className="b-dashboard-loader fa fa-spinner fa-5x fa-pulse"></div>
          </div>
        </div>
        <div className="b-dashboard__content-with-sidebar">
          <div className="b-dashboard-content-with-sidebar">
            <div className="b-dashboard__sidebar">
              <Sidebar/>
            </div>
            <div className="b-dashboard__content">
              {tab}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  tab: React.PropTypes.node
};

export default class DashboardContainer extends React.Component {
  render() {
    return (
        <AltContainer
            stores={{dashboardStore: DashboardStore}}
            inject={{
              tab: this.props.tab
            }}
        >
          <Dashboard/>
        </AltContainer>
    );
  }
}

DashboardContainer.propTypes = {
  tab: React.PropTypes.node
};
