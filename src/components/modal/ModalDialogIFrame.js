import React from 'react';

import ModalDialog from './ModalDialog';

export default class ModalDialogIFrame extends ModalDialog {

  renderContent() {
    return (
      <iframe className="b-modal-dialog-iframe" src={this.props.source} width={this.props.width} height={this.props.height}>
      </iframe>
    );
  }
}

ModalDialogIFrame.propTypes = Object.assign({}, ModalDialog.propTypes, {
  source: React.PropTypes.string.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired
});
