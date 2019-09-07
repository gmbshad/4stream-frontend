import alt from '../alt';
import {NotificationManager} from 'react-notifications';
import Constants from '../utils/Constants';

import NotificationActions from '../actions/NotificationActions';
import {localizeString} from '../localization/LocalizationUtils';

class NotificationStore {

  constructor() {
    this.bindActions(NotificationActions);
  }
  
  onPostMessage(messageId) {
    if (messageId === Constants.PAYMENT_SUCCESS_MESSAGE_ID) {
      const title = localizeString('NOTIFICATIONS.DONATION_SEND.TITLE');
      const text = localizeString('NOTIFICATIONS.DONATION_SEND.SUCCESS');
      NotificationManager.success(text, title);
    } else if (messageId === Constants.PAYMENT_ERROR_MESSAGE_ID) {
      const title = localizeString('NOTIFICATIONS.DONATION_SEND.TITLE');
      const text = localizeString('NOTIFICATIONS.DONATION_SEND.ERROR');
      NotificationManager.error(text, title);
    } else if (messageId === Constants.AUTH_ERROR_MESSAGE_ID) {
      const title = localizeString('NOTIFICATIONS.AUTH_ERROR.TITLE');
      const text = localizeString('NOTIFICATIONS.AUTH_ERROR.TEXT');
      NotificationManager.error(text, title);
    }
  }
}

export default alt.createStore(NotificationStore, 'NotificationStore');
