import alt from '../alt';
import {NotificationManager} from 'react-notifications';

import {fetchGet, fetchPost, fetchDelete} from '../api/FetchUtils';
import UserMediaActions from '../actions/UserMediaActions';
import Constants from '../utils/Constants';
import {MEDIA_TYPE} from '../utils/Constants';
import {PROMISE_OK} from '../utils/Constants';
import {localizeString} from '../localization/LocalizationUtils';

class UserMediaStore {
  
  constructor() {
    this.bindActions(UserMediaActions);
    
    Object.assign(this, this.getInitialState());
  }
  
  getInitialState() {
    return ({
      donationSoundFileName: null,
      donationImageFileName: null
    });
  }
  
  resetSettings() {
    this.setState(this.getInitialState());
  }
  
  isMediaMetaJsonValid(json) {
    return (json.donationSoundFileName !== undefined && json.donationImageFileName !== undefined);
  }
  
  getUrlByMediaId(mediaId) {
    return (mediaId === MEDIA_TYPE.DONATION_SOUND) 
        ? Constants.MEDIA_API_URL_DONATION_SOUND
        : Constants.MEDIA_API_URL_DONATION_IMAGE;
  }

  onRequestMediaMeta() {
    fetchGet(Constants.MEDIA_API_URL_DONATION_META)
        .then(response => response.json())
        .then((json) => {
          if (!this.isMediaMetaJsonValid(json)) {
            throw Error('Response JSON is not valid: ' + JSON.stringify(json));
          }
          UserMediaActions.receiveMediaMeta(json);
        })
        .catch(function(error) {
          UserMediaActions.receiveMediaMetaError(error);
        });
  }
  
  onReceiveMediaMeta(mediaMeta) {
    this.setState(mediaMeta);
  }
  
  onReceiveMediaMetaError(error) {
    console.error(error);
    this.resetSettings();
  }

  onRequestDonationMediaUpdate({formData, mediaId, fileName}) {
    const url = this.getUrlByMediaId(mediaId);
    fetchPost(url, {
      body: formData,
      headers: {
        [Constants.HTTP_HEADER_FILE_NAME]: encodeURIComponent(fileName)
      }
    })
        .then(response => {
          if (response.ok !== true) {
            return response.text();
          }
          UserMediaActions.receiveDonationMediaUpdate(mediaId);
          return Promise.resolve(PROMISE_OK);
        })
        .then(result => {
          if (result !== PROMISE_OK) {
            throw Error(result);
          }
        })
        .catch(error => {
          UserMediaActions.receiveDonationMediaUpdateError(mediaId, error);
        });
  }

  onReceiveDonationMediaUpdate(mediaId) {
    const title = localizeString('NOTIFICATIONS.SAVE_FILE.TITLE');
    const text = localizeString('NOTIFICATIONS.SAVE_FILE.SUCCESS');
    NotificationManager.success(text, title);
    console.log('Updated ' + mediaId);
    UserMediaActions.requestMediaMeta.defer();
  }

  onReceiveDonationMediaUpdateError({error}) {
    console.error(error);
    const title = localizeString('NOTIFICATIONS.SAVE_FILE.TITLE');
    const text = localizeString('NOTIFICATIONS.SAVE_FILE.ERROR');
    NotificationManager.error(text, title);
  }
  
  onRequestDonationMediaDelete(mediaId) {
    const url = this.getUrlByMediaId(mediaId);
    fetchDelete(url)
        .then(response => {
          if (response.ok !== true) {
            return response.text();
          }
          UserMediaActions.receiveDonationMediaDelete(mediaId);
          return Promise.resolve(PROMISE_OK);
        })
        .then(result => {
          if (result !== PROMISE_OK) {
            throw Error(result);
          }
        })
        .catch(error => {
          UserMediaActions.receiveDonationMediaDeleteError(error);
        });
  }
  
  onReceiveDonationMediaDelete(mediaId) {
    const title = localizeString('NOTIFICATIONS.REMOVE_FILE.TITLE');
    const text = localizeString('NOTIFICATIONS.REMOVE_FILE.SUCCESS');
    NotificationManager.success(text, title);
    console.log('Deleted ' + mediaId);
    UserMediaActions.requestMediaMeta.defer();
  }
  
  onReceiveDonationMediaDeleteError(error) {
    console.log(error);
    const title = localizeString('NOTIFICATIONS.REMOVE_FILE.TITLE');
    const text = localizeString('NOTIFICATIONS.REMOVE_FILE.ERROR');
    NotificationManager.error(text, title);
  }
}

export default alt.createStore(UserMediaStore, 'UserMediaStore');
