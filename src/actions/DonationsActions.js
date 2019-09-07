import alt from '../alt';

class DonationsActions {

  requestDonations({offset, limit, sortBy, sortOrder}) {
    return {offset, limit, sortBy, sortOrder};
  }

  receiveDonations(donations) {
    return donations;
  }

  receiveDonationsError(error) {
    return error;
  }
  
  requestDeleteDonation({donationId}) {
    return {donationId};
  }

  receiveDeleteDonation() {
    return true;
  }

  receiveDeleteDonationError(error) {
    return error;
  }

  requestAddManualDonation(donation) {
    return donation;
  }

  receiveAddManualDonation() {
    return true;
  }

  receiveAddManualDonationError(error) {
    return error;
  }

  requestAddPaymentDonation(donation) {
    return donation;
  }

  receiveAddPaymentDonationError(error) {
    return error;
  }
  
  requestAddTestDonation() {
    return true;
  }
  
  receiveAddTestDonation() {
    return true;
  }
  
  receiveAddTestDonationError(error) {
    return error;
  }

  authorizeDonationSender() {
    return true;
  }
}

export default alt.createActions(DonationsActions);
