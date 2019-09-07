import React from 'react';
import classNames from 'classnames';

import ModalDialogActions from '../../actions/ModalDialogActions';
import Button from '../Button';

export default class ModalDialog extends React.Component {

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
  }

  getParentClassNames() {
    return classNames('b-modal-dialog');
  }

  getContentClassNames() {
    return classNames('b-modal-dialog__content');
  }

  renderContent() {
    return null;
  }

  onClose() {
    // to be overridden in subclass if necessary
  }

  close() {
    this.onClose();
    ModalDialogActions.closeModal();
  }

  getControls() {
    return undefined;
  }

  renderControls() {
    let controls = undefined;
    const selfControls = this.getControls();
    if (this.props.controls !== undefined) {
      controls = this.props.controls;
    } else if (selfControls !== undefined) {
      controls = selfControls;
    }
    if (controls === undefined) {
      return null;
    }
    const controlsElements = controls.map(control => {
      const action = () => {
        control.action();
        if (!control.preventClose) {
          this.close();
        }
      };
      const disabled = (control.disabledCondition !== undefined && control.disabledCondition());
      return (
        <div className="b-modal-dialog-controls__item" key={control.key}>
          <Button text={control.label} onClick={action} wide disabled={disabled}/>
        </div>
      );
    });
    return (
      <div className="b-modal-dialog__controls">
        <div className="b-modal-dialog-controls">
          {controlsElements}
        </div>
      </div>   
    );
  }
  
  render() {
    return (
        <div className={this.getParentClassNames()}>
          <div className="b-modal-dialog__close">
            <div className="b-modal-dialog-close fa fa-times fa-lg" onClick={this.close}>
            </div>
          </div>
          <div className="b-modal-dialog__title">
            <div className="b-modal-dialog-title">
              {this.props.title}
            </div>
          </div>
          <div className={this.getContentClassNames()}>
            {this.renderContent()}
          </div>
          {this.renderControls()}
        </div>
    );
  }
}

ModalDialog.propTypes = {
  title: React.PropTypes.string.isRequired,
  controls: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      key: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired,
      action: React.PropTypes.func.isRequired
    })
  )
};
