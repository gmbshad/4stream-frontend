import cookie from 'react-cookie';

const SECONDS_IN_WEEK = 7 * 24 * 60 * 60;

function saveCookie(key, value) {
  cookie.save(key, value, { path: '/', maxAge: SECONDS_IN_WEEK});
}

function getCookie(key) {
  return cookie.load(key);
}

function removeCookie(key) {
  cookie.remove(key, { path: '/'});
}

export {saveCookie, getCookie, removeCookie};

