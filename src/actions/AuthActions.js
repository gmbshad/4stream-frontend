import alt from '../alt';

class AuthActions {

  requestLoginInfo() {
    return true;
  }

  receiveLoginInfo(loginInfo) {
    return loginInfo;
  }

  receiveLoginInfoError(error) {
    return error;
  }

  requestResetUserToken() {
    return true;
  }

  receiveResetUserToken() {
    return true;
  }

  receiveResetUserTokenError(error) {
    return error;
  }
}

export default alt.createActions(AuthActions);
