import React from 'react';

import ModalDialog from './ModalDialog';
import {localizeString} from '../../localization/LocalizationUtils';
import Constants from '../../utils/Constants';

export default class ModalDialogWelcome extends ModalDialog {

  onClose() {
    this.props.onInteraction();
  }

  renderLink(url, anchor) {
    return (
        <a className="b-welcome-dialog-link" href={url} target="_blank" onClick={this.props.onInteraction}>
          {anchor}
        </a>
    );
  }
  renderContent() {
    return (
      <div className="b-welcome-dialog">
        <div className="b-welcome-dialog__part">
          {localizeString('WELCOME_DIALOG.CONTENT_1')}
          {localizeString('WELCOME_DIALOG.CONTENT_2')}
        </div>
        <div className="b-welcome-dialog__part">
          {localizeString('WELCOME_DIALOG.CONTENT_3_1')}
          <b>{localizeString('WELCOME_DIALOG.CONTENT_3_2')}</b>
          {localizeString('WELCOME_DIALOG.CONTENT_3_3')}
          {this.renderLink(Constants.WELCOME_DIALOG_VIDEO_GUIDE_URL, localizeString('WELCOME_DIALOG.CONTENT_4'))}
          {localizeString('WELCOME_DIALOG.CONTENT_5')}
        </div>
        <div className="b-welcome-dialog__part">
          {localizeString('WELCOME_DIALOG.CONTENT_6_1')}
          <b>{localizeString('WELCOME_DIALOG.CONTENT_6_2')}</b>
          {localizeString('WELCOME_DIALOG.CONTENT_6_3')}
          {this.renderLink(Constants.WELCOME_DIALOG_PROMO_PRESENTATION_URL, localizeString('WELCOME_DIALOG.CONTENT_7'))}
          {localizeString('WELCOME_DIALOG.CONTENT_8')}
        </div>
      </div>
    );
  }

}

ModalDialogWelcome.propTypes = Object.assign({}, ModalDialog.propTypes, {
  onInteraction: React.PropTypes.func.isRequired
});
