/*global $*/
import 'jquery.cookie';

function getCookie(key) {
  return $.cookie(key);
}

function removeCookie(key) {
  $.removeCookie(key, { path: '/' });
}

export {getCookie, removeCookie};
