import alt from '../alt';

class DonationGoalActions {

  requestDonationGoalSettings() {
    return true;
  }

  receiveDonationGoalSettings(donationGoalSettings) {
    return donationGoalSettings;
  }

  receiveDonationGoalSettingsError(error) {
    return error;
  }

  requestDonationGoalSettingsUpdate(donationGoalSettings) {
    return donationGoalSettings;
  }

  receiveDonationGoalSettingsUpdate(donationGoalSettings) {
    return donationGoalSettings;
  }

  receiveDonationGoalSettingsUpdateError(error) {
    return error;
  }

  requestDonationGoals() {
    return true;
  }

  receiveDonationGoals(donationGoals) {
    return donationGoals;
  }

  receiveDonationGoalsError(error) {
    return error;
  }

  requestDonationGoalCreation(donationGoal) {
    return donationGoal;
  }

  receiveDonationGoalCreation() {
    return true;
  }

  receiveDonationGoalCreationError(error) {
    return error;
  }

  requestDonationGoalUpdate({donationGoalId, donationGoal}) {
    return {donationGoalId, donationGoal};
  }

  receiveDonationGoalUpdate() {
    return true;
  }

  receiveDonationGoalUpdateError(error) {
    return error;
  }

  requestDonationGoalDelete(donationGoalId) {
    return donationGoalId;
  }

  receiveDonationGoalDelete() {
    return true;
  }

  receiveDonationGoalDeleteError(error) {
    return error;
  }

  requestWidgetData(token) {
    return token;
  }

  receiveWidgetData(data) {
    return data;
  }

  receiveWidgetDataError(error) {
    return error;
  }
}

export default alt.createActions(DonationGoalActions);
