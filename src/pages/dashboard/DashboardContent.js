import React from 'react';
import classNames from 'classnames';
import {sprintf} from 'sprintf-js';

import AuthStore from '../../stores/AuthStore';
import ModalDialogActions from '../../actions/ModalDialogActions';
import {differenceInMinutesFromNow} from '../../utils/DateUtils';
import Constants from '../../utils/Constants';
import ModalDialogWelcome from '../../components/modal/ModalDialogWelcome';
import {localizeString} from '../../localization/LocalizationUtils';
import {saveCookie, getCookie} from '../../utils/CookieManager';

function renderContentPart(header, content) {
  return (
      <div className="b-dashboard-content-part">
        <div className="b-dashboard-content-part__header">
          <div className="b-dashboard-content-part-header">
            <div className="b-dashboard-content-part-header__text">
              {header}
            </div>
          </div>
          <div className="b-dashboard-content-part__body">
            {content}
          </div>
        </div>
      </div>
  );
}

class DashboardContent extends React.Component {

  componentDidMount() {
    const {userName, registerDate} = AuthStore.getState();
    const welcomeDialogCookie = getCookie(Constants.COOKIE_WELCOME_DIALOG);
    if (registerDate && welcomeDialogCookie === undefined) {
      const difference = differenceInMinutesFromNow(registerDate);
      if (difference > 0 && difference < Constants.WELCOME_DIALOG_EXPIRATION_MINUTES) {
        const title = sprintf(localizeString('WELCOME_DIALOG.GREETING'), userName);
        const markInteractionPerformed =
            () => {saveCookie(Constants.COOKIE_WELCOME_DIALOG, Constants.WELCOME_DIALOG_DISPLAYED);};
        const welcomeModal = <ModalDialogWelcome title={title} onInteraction={markInteractionPerformed}/>;
        ModalDialogActions.showModal.defer(welcomeModal);
      }
    }
  }

  renderContent() {
    return null;
  }
  
  getHeader() {
    console.error('must be overridden is subclass');
    return '';
  }

  render() {
    return (
        <div className="b-dashboard-content">
          <div className="b-dashboard-content__part">
            {renderContentPart(this.getHeader(), this.renderContent())}
          </div>
        </div>
    );
  }
}

class DashboardMultiPartContent extends React.Component {
  getParts() {
    console.error('must be overridden is subclass');
    return [];
  }

  render() {
    const parts = this.getParts().map((part, index) => {
      const contentPartClassNames = classNames({
        'b-dashboard-content__part': true,
        'b-dashboard-content__part--margin-top': (index > 0)
      });
      return (
          <div className={contentPartClassNames} key={part.header}>
            {renderContentPart(part.header, part.content)}
          </div>
      );
    });
    return (
      <div className="b-dashboard-content">
        {parts}
      </div>
    );
  }
}

export {DashboardContent, DashboardMultiPartContent};
