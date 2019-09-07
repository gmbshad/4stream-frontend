/*global $*/
import {requestLatestNews, requestLoginStatus} from './Api';
import {getDashboardLoginUrl} from '../../utils/Auth';
import {formatDateTime} from './DateUtils';
import {showNotification} from './NotificationManager';
import {getCookie, removeCookie} from './CookieManager';
import Constants from '../../utils/Constants';
import {localizeString} from '../../localization/LocalizationUtils';
import {refreshFeeCalculation} from '../src/Tariffs';
import {renderNews} from '../src/News';

function loginStatusCallback(isLoggedIn) {
  const loginButtons = $('.login-button');
  const url = isLoggedIn ? '/dashboard' : getDashboardLoginUrl();
  loginButtons.each(function() {
    $(this).attr('href', url);
    $(this).removeClass('disabled');
  });
}

function latestNewsCallback(news) {
  const latestNews = $('.latest-news-list');
  news.slice(0, 3).forEach((newsItem, index) => {
    latestNews.append(`
      <li>
        <a href="/news.html#newsItem${index}">${newsItem.title}</a>
        <small>${formatDateTime(newsItem.timestamp)}</small>
      </li>
      `
    );
  });
  const newsBlog = $('.news-blog');
  if (newsBlog) {
    renderNews(newsBlog, news);
  }
}

function processCookies() {
  const messageId = getCookie(Constants.COOKIE_MESSAGE_ID);
  if (messageId === Constants.AUTH_ERROR_MESSAGE_ID) {
    removeCookie(Constants.COOKIE_MESSAGE_ID);
    showNotification(localizeString('NOTIFICATIONS.AUTH_ERROR.COMBINED'), 'danger');
  }
  const redirectUrl = getCookie(Constants.COOKIE_REDIRECT);
  if (redirectUrl !== undefined) {
    removeCookie(Constants.COOKIE_REDIRECT);
    window.location.href = redirectUrl;
  }
}

function initTariffsIfNecessary() {
  const amountInput = $('#inputAmount');
  const inputPaymentType = $('#inputPaymentType');
  if (amountInput && inputPaymentType) {
    amountInput.on('input', refreshFeeCalculation);
    inputPaymentType.on('change', refreshFeeCalculation);
    refreshFeeCalculation();
  }
}

function onDOMContentLoaded() {
  showNotification(localizeString('DONATION_WIDGET.REMARK'), 'warning', -1);
  processCookies();
  requestLoginStatus(loginStatusCallback);
  requestLatestNews(latestNewsCallback);
  initTariffsIfNecessary();
}

export {onDOMContentLoaded};

