import React from 'react';
import alt from '../alt';
import AltContainer from 'alt-container';
import ActionListeners from 'alt-utils/lib/ActionListeners';
import {NotificationContainer} from 'react-notifications';
import classNames from 'classnames';

import AuthActions from '../actions/AuthActions';
import SettingsActions from '../actions/SettingsActions';
import ModalDialogManager from '../components/modal/ModalDialogManager';
import ModalDialogStore from '../stores/ModalDialogStore';
import LocalizationStore from '../stores/LocalizationStore';
import Constants from '../utils/Constants';

class App extends React.Component {
  componentWillMount() {
    AuthActions.requestLoginInfo();
    this.actionListener = new ActionListeners(alt);
    this.actionListener.addActionListener(
        AuthActions.receiveLoginInfo.id, (loginInfo) => {
          if (loginInfo.userId !== null) {
            SettingsActions.requestSettings.defer();
          }
        });
  }
  
  componentWillUnmount() {
    this.actionListener.removeAllActionListeners();
  }

  render() {
    const {modal} = this.props.modalDialogStore;
    const pageClassModification = (modal !== null) ? 'b-app-container__page--inactive' : '';
    const pageClassNames = `b-app-container__page ${pageClassModification}`;

    const path = this.props.location.pathname;
    const appContainerClassNames = classNames({
      'b-app-container': true,
      'b-app-container--widget': (path === Constants.DONATION_WIDGET_URL || path === Constants.DONATION_GOAL_URL)
    });
    return (
      <div className={appContainerClassNames}>
        <div className="b-app-container__notifications">
          <NotificationContainer/>
        </div>
        <div className="b-app-container__modal-manager">
          <ModalDialogManager/>
        </div>
        <div className={pageClassNames}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  modalDialogStore: React.PropTypes.shape({
    modal: React.PropTypes.element
  }),
  children: React.PropTypes.element,
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired
  })
};

export default class AppContainer extends React.Component {
  render() {
    return (
        <AltContainer stores={{modalDialogStore: ModalDialogStore, localizationStore: LocalizationStore}}>
          <App {...this.props}/>
        </AltContainer>
    );
  }
}
