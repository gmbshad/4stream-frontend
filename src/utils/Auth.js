import Constants from './Constants';

function getLoginUrl(state) {
  return 'https://api.twitch.tv/kraken/oauth2/authorize' +
      '?response_type=code' +
      `&client_id=${Constants.TWITCH_APP_ID}` +
      `&redirect_uri=${Constants.AUTH_API_URL_LOGIN}` +
      `&scope=${Constants.TWITCH_AUTH_PERMISSIONS}` +
      `&state=${state}` +
      `&force_verify=true`;
}

function getDashboardLoginUrl() {
  return getLoginUrl(Constants.TWITCH_STATE_DASHBOARD_LOGIN);
}

function getSenderLoginUrl() {
  return getLoginUrl(Constants.TWITCH_STATE_SENDER_LOGIN);
}

function getLogoutUrl() {
  return Constants.AUTH_API_URL_LOGOUT;
}

export {getDashboardLoginUrl, getSenderLoginUrl, getLogoutUrl};
