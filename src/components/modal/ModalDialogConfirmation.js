import React from 'react';
import classNames from 'classnames';

import ModalDialog from './ModalDialog';

export default class ModalDialogConfirmation extends ModalDialog {

  getParentClassNames() {
    return classNames('b-modal-dialog--confirmation', super.getParentClassNames());
  }

  renderContent() {
    return this.props.text;
  }

}

ModalDialogConfirmation.propTypes = Object.assign({}, ModalDialog.propTypes, {
  text: React.PropTypes.string.isRequired
});
