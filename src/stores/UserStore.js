import alt from '../alt';
import UserActions from '../actions/UserActions';

import Constants from '../utils/Constants';
import {fetchGet} from '../api/FetchUtils';

class UserStore {

  constructor() {
    this.bindActions(UserActions);
    this.users = null;
  }

  onRequestPromoActionParticipators() {
    fetchGet(Constants.USER_API_URL_PROMO)
        .then((response) => response.json())
        .then((json) => {
          if (json.users) {
            UserActions.receivePromoActionParticipators(json.users);
          } else {
            UserActions.receivePromoActionParticipatorsError('Response JSON is not valid: ' + JSON.stringify(json));
          }
        })
        .catch(function(ex) {
          UserActions.receivePromoActionParticipatorsError(ex);
        });
  }

  onReceivePromoActionParticipators(users) {
    this.users = users;
  }

  onReceivePromoActionParticipatorsError(error) {
    console.error('USER_API_URL_PROMO failed:', error);
    this.users = null;
  }
}

export default alt.createStore(UserStore, 'UserStore');
