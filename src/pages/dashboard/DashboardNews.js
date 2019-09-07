import React from 'react';

import News from '../../components/News';
import {DashboardContent} from './DashboardContent';
import {localizeString} from '../../localization/LocalizationUtils';
import {NEWS_PROP_TYPE} from '../../utils/Types';

export default class DashboardNews extends DashboardContent {

  getHeader() {
    return localizeString('DASHBOARD_NEWS.TITLE');
  }

  renderNewsContent() {
    return <News/>;
  }

  renderContent() {
    return (
        <div className="b-dashboard-news">
          {this.renderNewsContent()}
        </div>
    );
  }
}

DashboardNews.propTypes = {
  news: NEWS_PROP_TYPE
};
