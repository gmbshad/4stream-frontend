import alt from '../alt';

import {fetchGet} from '../api/FetchUtils';
import NewsActions from '../actions/NewsActions';
import Constants from '../utils/Constants';

class NewsStore {

  setNews(news) {
    this.setState({news});
  }
  
  resetNews() {
    this.setNews(null);
  }
  
  constructor() {
    this.bindActions(NewsActions);
    this.news = null;
  }

  onRequestLatestNews() {
    fetchGet(Constants.NEWS_API_URL_LATEST)
        .then((response) => response.json())
        .then((json) => {
          const news = json.news;
          if (news) {
            NewsActions.receiveLatestNews(news);
          } else {
            throw Error('Response JSON does not contain news: ' + JSON.stringify(json));
          }
        })
        .catch(function(error) {
          NewsActions.receiveLatestNewsError(error);
        });
  }

  onReceiveLatestNews(news) {
    this.setNews(news);
  }
  
  onReceiveLatestNewsError(error) {
    console.error('NEWS_API_URL_LATEST failed:', error);
    this.resetNews();
  }
}

export default alt.createStore(NewsStore, 'NewsStore');
