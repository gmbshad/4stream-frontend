import alt from '../alt';

class UserActions {

  // TODO remove all promo-related stuff
  requestPromoActionParticipators() {
    return true;
  }

  receivePromoActionParticipators(users) {
    return users;
  }

  receivePromoActionParticipatorsError(error) {
    return error;
  }
}

export default alt.createActions(UserActions);
