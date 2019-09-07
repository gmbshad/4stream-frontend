import alt from '../alt';

class UserMediaActions {

  requestMediaMeta() {
    return true;
  }

  receiveMediaMeta(mediaMeta) {
    return mediaMeta;
  }

  receiveMediaMetaError(error) {
    return error;
  }
  
  requestDonationMediaUpdate({formData, mediaId, fileName}) {
    return {formData, mediaId, fileName};
  }
  
  receiveDonationMediaUpdate(mediaId) {
    return mediaId;
  }
  
  receiveDonationMediaUpdateError(mediaId, error) {
    return {mediaId, error};
  }

  requestDonationMediaDelete(mediaId) {
    return mediaId;
  }

  receiveDonationMediaDelete(mediaId) {
    return mediaId;
  }

  receiveDonationMediaDeleteError(error) {
    return error;
  }
}

export default alt.createActions(UserMediaActions);
