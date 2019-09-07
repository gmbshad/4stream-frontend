import alt from '../alt';
import AuthActions from '../actions/AuthActions';

import Constants from '../utils/Constants';
import {ACCOUNT_TYPE} from '../utils/Constants';
import {fetchGet, fetchPut} from '../api/FetchUtils';
import {PROMISE_OK} from '../utils/Constants';


class AuthStore {

  resetLoginInfo() {
    this.setLoginInfo({
      userId: undefined,
      accountType: undefined,
      userName: undefined,
      token: undefined,
      registerDate: undefined
    });
  }

  setLoginInfo(loginInfo) {
    this.userId = loginInfo.userId;
    this.accountType = loginInfo.accountType;
    this.userName = loginInfo.userName;
    this.token = loginInfo.token;
    this.registerDate = loginInfo.registerDate;
  }

  constructor() {
    this.bindActions(AuthActions);
    this.resetLoginInfo();
  }

  validateLoginInfo(json) {
    return (json.userId || json.userId === null) &&
        (json.accountType === ACCOUNT_TYPE.TWITCH || json.accountType === null) &&
        (json.userName || json.userName === null) &&
        (json.token || json.token === null) &&
        (json.registerDate || json.registerDate === null);
  }
  
  onRequestLoginInfo() {
    fetchGet(Constants.USER_API_URL_CURRENT)
        .then((response) => response.json())
        .then((json) => {
          if (this.validateLoginInfo(json)) {
            AuthActions.receiveLoginInfo(json);
          } else {
            AuthActions.receiveLoginInfoError('Response JSON is not valid: ' + JSON.stringify(json));
          }
        })
        .catch(function(ex) {
          AuthActions.receiveLoginInfoError(ex);
        });
  }

  onReceiveLoginInfo(loginInfo) {
    this.setLoginInfo(loginInfo);
  }

  onReceiveLoginInfoError(error) {
    console.error('USER_API_URL_CURRENT failed:', error);
    this.resetLoginInfo();
  }

  onRequestResetUserToken() {
    fetchPut(Constants.USER_API_URL_RESET_TOKEN)
        .then((response) => {
          if (response.ok !== true) {
            return response.text();
          }
          AuthActions.receiveResetUserToken();
          return Promise.resolve(PROMISE_OK);
        })
        .then(result => {
          if (result !== PROMISE_OK) {
            throw Error(result);
          }
        })
        .catch(function(error) {
          AuthActions.receiveResetUserTokenError(error);
        });
  }

  onReceiveResetUserToken() {
    AuthActions.requestLoginInfo.defer();
  }

  onReceiveResetUserTokenError(error) {
    console.error('USER_API_URL_RESET_TOKEN failed:', error);
  }
}

export default alt.createStore(AuthStore, 'AuthStore');
