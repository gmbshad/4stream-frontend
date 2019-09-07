import alt from '../alt';

import ModalDialogActions from '../actions/ModalDialogActions';

class ModalDialogStore {

  constructor() {
    this.bindActions(ModalDialogActions);

    Object.assign(this, this.getInitialState());
    this.bindCloseModalOnEscape();
    this.bindCloseModalOnMessage();
  }

  getInitialState() {
    return ({
      modal: null
    });
  }

  resetModal() {
    this.setState(this.getInitialState());
  }

  setModal(modal) {
    this.setState({modal});
  }

  bindCloseModalOnEscape() {
    document.onkeyup = function(event) {
      // escape
      if (event.keyCode === 27) {
        ModalDialogActions.closeModal();
      }
    };
  }

  bindCloseModalOnMessage() {
    window.addEventListener('message', (message) => {
      if (message.data === 'donationEnded') {
        ModalDialogActions.closeModal();
      }
    });
  }

  onShowModal(modal) {
    this.setModal(modal);
  }

  onCloseModal() {
    this.resetModal();
  }
}

export default alt.createStore(ModalDialogStore, 'ModalDialogStore');
