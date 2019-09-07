import alt from '../alt';

import AuthActions from '../actions/AuthActions';
import DashboardActions from '../actions/DashboardActions';
import NewsActions from '../actions/NewsActions';
import StatisticsActions from '../actions/StatisticsActions';
import DonationsActions from '../actions/DonationsActions';
import SettingsActions from '../actions/SettingsActions';
import UserMediaActions from '../actions/UserMediaActions';
import UserActions from '../actions/UserActions';
import DonationGoalActions from '../actions/DonationGoalActions';
import DonationAlertSettingsActions from '../actions/DonationAlertSettingsActions';

import AuthStore from '../stores/AuthStore';
import SettingsStore from '../stores/SettingsStore';

const AUTH_STATE = {
  AUTHENTICATED: 'authenticated',
  NOT_AUTHENTICATED: 'not_authenticated',
  UNKNOWN: 'unknown'
};

class DashboardStore {

  getInitialState() {
    return ({
      userAuthState: AUTH_STATE.UNKNOWN,
      userSettingsInitialized: false,
      userDataReady: false,
      
      isRequestsPerforming: false,
      newsRequests: 0,
      statisticsRequests: 0,
      donationsRequests: 0,
      settingsRequests: 0,
      userMediaRequests: 0,
      userRequests: 0,
      donationGoalRequests: 0,
      donationAlertSettingsRequests: 0,
      authRequests: 0
    });
  }

  constructor() {
    Object.assign(this, this.getInitialState());

    this.bindActions(AuthActions);
    this.bindActions(DashboardActions);
    this.bindActions(NewsActions);
    this.bindActions(StatisticsActions);
    this.bindActions(DonationsActions);
    this.bindActions(SettingsActions);
    this.bindActions(UserMediaActions);
    this.bindActions(UserActions);
    this.bindActions(DonationGoalActions);
    this.bindActions(DonationAlertSettingsActions);

    AuthStore.listen((state) => DashboardActions.handleAuthStoreUpdate.defer(state));
    SettingsStore.listen((state) => DashboardActions.handleSettingsStoreUpdate.defer(state));
  }

  refreshUserDataState() {
    const {userAuthState, userSettingsInitialized} = this;

    let userDataReady = (userAuthState !== AUTH_STATE.UNKNOWN);
    if (userAuthState === AUTH_STATE.AUTHENTICATED) {
      userDataReady = userSettingsInitialized;
    }
    this.setState({userDataReady});
  }

  incrementRequests(fieldName) {
    this.setState({
      [fieldName]: this[fieldName] + 1
    });
    this.refreshIsRequestsPerforming();
  }

  decrementRequests(fieldName) {
    this.setState({
      [fieldName]: this[fieldName] - 1
    });
    this.refreshIsRequestsPerforming();
  }
  
  refreshIsRequestsPerforming() {
    this.setState({
      isRequestsPerforming: (this.newsRequests !== 0 || this.statisticsRequests !== 0 || this.donationsRequests !== 0 ||
          this.settingsRequests !== 0 || this.userMediaRequests !== 0 || this.userRequests !== 0 ||
          this.donationGoalRequests !== 0 || this.donationAlertSettingsRequests !== 0 || this.authRequests !== 0)
    });
  }

  // User data actions *************************************************************************************************
  onHandleAuthStoreUpdate(state) {
    const {userId} = state;
    let userAuthState = AUTH_STATE.UNKNOWN;
    if (userId !== undefined) {
      userAuthState = (userId !== null) ? AUTH_STATE.AUTHENTICATED : AUTH_STATE.NOT_AUTHENTICATED;
    }
    this.setState({
      userAuthState
    });
    this.refreshUserDataState();
  }

  onHandleSettingsStoreUpdate(state) {
    this.setState({
      userSettingsInitialized: state.settingsInitialized
    });
    this.refreshUserDataState();
  }

  // News actions ******************************************************************************************************
  onRequestLatestNews() {
    this.incrementRequests('newsRequests');
  }

  onReceiveLatestNews() {
    this.decrementRequests('newsRequests');
  }

  onReceiveLatestNewsError() {
    this.decrementRequests('newsRequests');
  }

  // Statistics actions ************************************************************************************************
  onRequestStatistics() {
    this.incrementRequests('statisticsRequests');
  }

  onReceiveStatistics() {
    this.decrementRequests('statisticsRequests');
  }

  onReceiveStatisticsError() {
    this.decrementRequests('statisticsRequests');
  }

  // Donations actions *************************************************************************************************
  onRequestDonations() {
    this.incrementRequests('donationsRequests');
  }

  onReceiveDonations() {
    this.decrementRequests('donationsRequests');
  }

  onReceiveDonationsError() {
    this.decrementRequests('donationsRequests');
  }

  onRequestDeleteDonation() {
    this.incrementRequests('donationsRequests');
  }

  onReceiveDeleteDonation() {
    this.decrementRequests('donationsRequests');
  }

  onReceiveDeleteDonationError() {
    this.decrementRequests('donationsRequests');
  }

  onRequestAddManualDonation() {
    this.incrementRequests('donationsRequests');
  }

  onReceiveAddManualDonation() {
    this.decrementRequests('donationsRequests');
  }

  onReceiveAddManualDonationError() {
    this.decrementRequests('donationsRequests');
  }

  onRequestAddTestDonation() {
    this.incrementRequests('donationsRequests');
  }

  onReceiveAddTestDonation() {
    this.decrementRequests('donationsRequests');
  }

  onReceiveAddTestDonationError() {
    this.decrementRequests('donationsRequests');
  }

  // Settings actions **************************************************************************************************
  onRequestSettings() {
    this.incrementRequests('settingsRequests');
  }

  onReceiveSettings() {
    this.decrementRequests('settingsRequests');
  }

  onReceiveSettingsError() {
    this.decrementRequests('settingsRequests');
  }

  onRequestSettingsUpdate() {
    this.incrementRequests('settingsRequests');
  }

  onReceiveSettingsUpdate() {
    this.decrementRequests('settingsRequests');
  }

  onReceiveSettingsUpdateError() {
    this.decrementRequests('settingsRequests');
  }

  // Donation Alert Settings actions ***********************************************************************************
  onRequestDonationAlertSettings() {
    this.incrementRequests('donationAlertSettingsRequests');
  }

  onRequestDonationAlertSettingsByToken() {
    this.incrementRequests('donationAlertSettingsRequests');
  }

  onReceiveDonationAlertSettings() {
    this.decrementRequests('donationAlertSettingsRequests');
  }

  onReceiveDonationAlertSettingsError() {
    this.decrementRequests('donationAlertSettingsRequests');
  }

  onRequestDonationAlertSettingsUpdate() {
    this.incrementRequests('donationAlertSettingsRequests');
  }

  onReceiveDonationAlertSettingsUpdate() {
    this.decrementRequests('donationAlertSettingsRequests');
  }

  onReceiveDonationAlertSettingsUpdateError() {
    this.decrementRequests('donationAlertSettingsRequests');
  }

  // UserMedia actions *************************************************************************************************
  onRequestMediaMeta() {
    this.incrementRequests('userMediaRequests');
  }

  onReceiveMediaMeta() {
    this.decrementRequests('userMediaRequests');
  }

  onReceiveMediaMetaError() {
    this.decrementRequests('userMediaRequests');
  }

  onRequestDonationMediaUpdate() {
    this.incrementRequests('userMediaRequests');
  }

  onReceiveDonationMediaUpdate() {
    this.decrementRequests('userMediaRequests');
  }

  onReceiveDonationMediaUpdateError() {
    this.decrementRequests('userMediaRequests');
  }

  onRequestDonationMediaDelete() {
    this.incrementRequests('userMediaRequests');
  }

  onReceiveDonationMediaDelete() {
    this.decrementRequests('userMediaRequests');
  }

  onReceiveDonationMediaDeleteError() {
    this.decrementRequests('userMediaRequests');
  }

  // User actions *************************************************************************************************
  onRequestPromoActionParticipators() {
    this.incrementRequests('userRequests');
  }

  onReceivePromoActionParticipators() {
    this.decrementRequests('userRequests');
  }

  onReceivePromoActionParticipatorsError() {
    this.decrementRequests('userRequests');
  }

  // DonationGoal actions *********************************************************************************************
  onRequestDonationGoalSettings() {
    this.incrementRequests('donationGoalRequests');
  }

  onReceiveDonationGoalSettings() {
    this.decrementRequests('donationGoalRequests');
  }

  onReceiveDonationGoalSettingsError() {
    this.decrementRequests('donationGoalRequests');
  }

  onRequestDonationGoalSettingsUpdate() {
    this.incrementRequests('donationGoalRequests');
  }

  onReceiveDonationGoalSettingsUpdate() {
    this.decrementRequests('donationGoalRequests');
  }

  onReceiveDonationGoalSettingsUpdateError() {
    this.decrementRequests('donationGoalRequests');
  }

  onRequestDonationGoals() {
    this.incrementRequests('donationGoalRequests');
  }

  onReceiveDonationGoals() {
    this.decrementRequests('donationGoalRequests');
  }

  onReceiveDonationGoalsError() {
    this.decrementRequests('donationGoalRequests');
  }

  onRequestDonationGoalCreation() {
    this.incrementRequests('donationGoalRequests');
  }

  onReceiveDonationGoalCreation() {
    this.decrementRequests('donationGoalRequests');
  }

  onReceiveDonationGoalCreationError() {
    this.decrementRequests('donationGoalRequests');
  }

  onRequestDonationGoalUpdate() {
    this.incrementRequests('donationGoalRequests');
  }

  onReceiveDonationGoalUpdate() {
    this.decrementRequests('donationGoalRequests');
  }

  onReceiveDonationGoalUpdateError() {
    this.decrementRequests('donationGoalRequests');
  }

  onRequestDonationGoalDelete() {
    this.incrementRequests('donationGoalRequests');
  }

  onReceiveDonationGoalDelete() {
    this.decrementRequests('donationGoalRequests');
  }

  onReceiveDonationGoalDeleteError() {
    this.decrementRequests('donationGoalRequests');
  }

  // Auth actions ******************************************************************************************************
  onRequestResetUserToken() {
    this.incrementRequests('authRequests');
  }

  onReceiveResetUserToken() {
    this.decrementRequests('authRequests');
  }

  onReceiveResetUserTokenError() {
    this.decrementRequests('authRequests');
  }

}

export {AUTH_STATE};
export default alt.createStore(DashboardStore, 'DashboardStore');
