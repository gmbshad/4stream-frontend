import alt from '../alt';

class NewsActions {

  requestLatestNews() {
    return true;
  }

  receiveLatestNews(news) {
    return news;
  }

  receiveLatestNewsError(error) {
    return error;
  }
}

export default alt.createActions(NewsActions);
