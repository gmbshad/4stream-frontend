import React from 'react';
import AltContainer from 'alt-container';

import NewsItem from './NewsItem';
import SettingsStore from '../stores/SettingsStore';
import NewsStore from '../stores/NewsStore';
import NewsActions from '../actions/NewsActions';
import {localizeString} from '../localization/LocalizationUtils';
import {NEWS_PROP_TYPE} from '../utils/Types';

class News extends React.Component {

  componentWillMount() {
    this.setState({
      timeZone: SettingsStore.getState().timeZone
    });
  }

  componentDidMount() {
    NewsActions.requestLatestNews.defer();
  }

  renderNewsContent() {
    const {news} = this.props;
    const {timeZone} = this.state;
    if (news === null) {
      return null;
    } else if (news.length === 0) {
      return localizeString('DASHBOARD_NEWS.NO_NEWS');
    }
    return news.map(newsItem =>
        <div className="b-dashboard-news__item" key={newsItem.id}>
          <NewsItem item={newsItem} timeZone={timeZone}/>
        </div>
    );
  }

  render() {
    return (
        <div className="b-news-component">
          {this.renderNewsContent()}
        </div>
    );
  }
}

News.propTypes = {
  news: NEWS_PROP_TYPE
};

export default class NewsContainer extends React.Component {
  render() {
    return (
        <AltContainer store={NewsStore}>
          <News {...this.props}/>
        </AltContainer>
    );
  }
}
