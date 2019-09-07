import Constants from '../../utils/Constants';
import {doFetch} from '../../api/FetchRequest';

function requestLatestNews(callback) {
  return doFetch({url: Constants.NEWS_API_URL_LATEST, method: 'GET'})
      .then((response) => response.json())
      .then((json) => {
        if (json.news !== undefined) {
          callback(json.news);
        } else {
          throw Error('Response JSON is not valid: ' + JSON.stringify(json));
        }
      })
      .catch(function(ex) {
        console.error('Error on NEWS_API_URL_LATEST: ' + ex);
      });
}

function requestLoginStatus(callback) {
  return doFetch({url: Constants.USER_API_URL_CURRENT, method: 'GET'})
      .then((response) => response.json())
      .then((json) => {
        if (json.userId || json.userId === null) {
          const isLoggedIn = json.userId !== null;
          callback(isLoggedIn);
        } else {
          throw Error('Response JSON is not valid: ' + JSON.stringify(json));
        }
      })
      .catch(function(ex) {
        console.error('Error on USER_API_URL_CURRENT: ' + ex);
      });
}

export {requestLatestNews, requestLoginStatus};
