import alt from '../alt';

class ModalDialogActions {

  showModal(modal) {
    return modal;
  }
  
  closeModal() {
    return true;
  }
}

export default alt.createActions(ModalDialogActions);
