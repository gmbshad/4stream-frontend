import React from 'react';
import AltContainer from 'alt-container';

import ModalDialogStore from '../../stores/ModalDialogStore';

class ModalDialogManager extends React.Component {

  render() {
    const {modal} = this.props;
    if (modal === null) {
      return null;
    }
    return modal;
  }
}

ModalDialogManager.propTypes = {
  modal: React.PropTypes.element
};

export default class ModalDialogManagerContainer extends React.Component {
  render() {
    return (
        <AltContainer store={ModalDialogStore}>
          <ModalDialogManager/>
        </AltContainer>
    );
  }
}

