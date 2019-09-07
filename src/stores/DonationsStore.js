import alt from '../alt';
import {NotificationManager} from 'react-notifications';

import {fetchGet, fetchPost, fetchDelete} from '../api/FetchUtils';
import DonationsActions from '../actions/DonationsActions';
import Constants from '../utils/Constants';
import {PROMISE_OK} from '../utils/Constants';
import {getCurrentLocation} from '../utils/NavigationUtils';
import {saveCookie, removeCookie} from '../utils/CookieManager';
import {localizeString} from '../localization/LocalizationUtils';
import {navigateToExternal} from '../utils/NavigationUtils';
import {getSenderLoginUrl} from '../utils/Auth';

class DonationsStore {

  setDonations(donations) {
    if (donations === null) {
      this.donations = {
        offset: 0,
        limit: 0,
        total: 0,
        donations: null
      };
    } else {
      this.donations = donations;
    }
  }
  
  resetDonations() {
    this.setDonations(null);
  }
  
  constructor() {
    this.bindActions(DonationsActions);
    this.resetDonations();
    this.bindTestDonationHandler();
  }

  bindTestDonationHandler() {
    window.addEventListener('message', (message) => {
      if (message.data === 'addTestDonation') {
        DonationsActions.requestAddTestDonation();
      }
    });
  }

  validateDonationsJson(donations) {
    return (donations.offset !== undefined &&
        donations.limit !== undefined &&
        donations.total !== undefined &&
        donations.donations !== undefined);
  }

  onRequestDonations({offset, limit, sortBy, sortOrder}) {
    const offsetOrZero = !offset ? 0 : offset;
    const limitOrZero = !limit ? 0 : limit;
    let url = `${Constants.DONATION_API_URL_DONATIONS}?offset=${offsetOrZero}&limit=${limitOrZero}`;
    url = !sortBy ? url : url.concat(`&sortBy=${sortBy}`);
    url = !sortOrder ? url : url.concat(`&sortOrder=${sortOrder}`);
    fetchGet(url)
        .then((response) => response.json())
        .then((json) => {
          if (!this.validateDonationsJson(json)) {
            throw Error('Response JSON is not valid: ' + JSON.stringify(json));
          }
          DonationsActions.receiveDonations(json);
        })
        .catch(function(error) {
          DonationsActions.receiveDonationsError(error);
        });
  }

  onReceiveDonations(donations) {
    this.setDonations(donations);
  }
  
  onReceiveDonationsError(error) {
    console.error('DONATION_API_URL_DONATIONS failed:', error);
    this.resetDonations();
  }

  onRequestDeleteDonation({donationId}) {
    const url = `${Constants.DONATION_API_URL_DELETE}${donationId}`;
    fetchDelete(url)
        .then((response) => {
          if (response.ok !== true) {
            return response.text();
          }
          DonationsActions.receiveDeleteDonation();
          return Promise.resolve(PROMISE_OK);
        })
        .then(result => {
          if (result !== PROMISE_OK) {
            throw Error(result);
          }
        })
        .catch(function(error) {
          DonationsActions.receiveDeleteDonationError(error);
        });
  }

  onReceiveDeleteDonation() {
    const title = localizeString('NOTIFICATIONS.DONATION_REMOVAL.TITLE');
    const text = localizeString('NOTIFICATIONS.DONATION_REMOVAL.SUCCESS');
    NotificationManager.success(text, title);
  }

  onReceiveDeleteDonationError(error) {
    const title = localizeString('NOTIFICATIONS.DONATION_REMOVAL.TITLE');
    const text = localizeString('NOTIFICATIONS.DONATION_REMOVAL.ERROR');
    NotificationManager.error(text, title);
    console.error(error);
  }
  
  onRequestAddPaymentDonation({donationView, sendDonationForm, donationIdInput}) {
    const donationString = JSON.stringify(donationView);
    fetchPost(Constants.DONATION_API_URL_PREPARE, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: donationString
    })
        .then((response) => response.json())
        .then((json) => {
          const preparedDonationId = json.id;
          if (preparedDonationId === undefined) {
            throw Error('Response JSON does not contain necessary fields: ' + JSON.stringify(json));
          }
          donationIdInput.value = preparedDonationId;

          this.setRedirectCookie();

          sendDonationForm.submit();
        })
        .catch(function(error) {
          DonationsActions.receiveAddPaymentDonationError(error);
        });
  }

  setRedirectCookie() {
    removeCookie(Constants.COOKIE_REDIRECT);
    saveCookie(Constants.COOKIE_REDIRECT, getCurrentLocation());
  }

  onReceiveAddPaymentDonationError(error) {
    this.receiveAddDonationError(error);
  }
  
  onRequestAddManualDonation(donation) {
    this.postDonation({
      url: Constants.DONATION_API_URL_SEND,
      body: JSON.stringify(donation),
      successAction: DonationsActions.receiveAddManualDonation,
      errorAction: DonationsActions.receiveAddManualDonationError
    });
  }
  
  onReceiveAddManualDonation() {
    this.receiveAddDonation();
  }
  
  onReceiveAddManualDonationError(error) {
    this.receiveAddDonationError(error);
  }
  
  onRequestAddTestDonation() {
    this.postDonation({
      url: Constants.DONATION_API_URL_SEND_TEST,
      body: undefined,
      successAction: DonationsActions.receiveAddTestDonation,
      errorAction: DonationsActions.receiveAddTestDonationError
    });
  }

  onReceiveAddTestDonation() {
    this.receiveAddDonation();
  }

  onReceiveAddTestDonationError(error) {
    this.receiveAddDonationError(error);
  }

  postDonation({url, body, successAction, errorAction}) {
    fetchPost(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })
        .then((response) => {
          if (response.ok !== true) {
            return response.text();
          }
          successAction();
          return Promise.resolve(PROMISE_OK);
        })
        .then(result => {
          if (result !== PROMISE_OK) {
            throw Error(result);
          }
        })
        .catch(function(error) {
          errorAction(error);
        });
  }

  receiveAddDonation() {
    const title = localizeString('NOTIFICATIONS.DONATION_SEND.TITLE');
    const text = localizeString('NOTIFICATIONS.DONATION_SEND.SUCCESS');
    NotificationManager.success(text, title);
  }

  receiveAddDonationError(error) {
    const title = localizeString('NOTIFICATIONS.DONATION_SEND.TITLE');
    const text = localizeString('NOTIFICATIONS.DONATION_SEND.ERROR');
    NotificationManager.error(text, title);
    console.error(error);
  }

  onAuthorizeDonationSender() {
    this.setRedirectCookie();
    navigateToExternal(getSenderLoginUrl());
  }
}

export default alt.createStore(DonationsStore, 'DonationsStore');
