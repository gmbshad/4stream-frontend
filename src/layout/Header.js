import React from 'react';
import AltContainer from 'alt-container';
import classNames from 'classnames';

import AuthStore from '../stores/AuthStore';
import {getDashboardLoginUrl, getLogoutUrl} from '../utils/Auth';
import {Link} from 'react-router';
import {getPersonalPageUrl, getDonationWidgetUrl} from '../utils/UrlUtils';
import {getCurrentLocation} from '../utils/NavigationUtils';
import {localizeString} from '../localization/LocalizationUtils';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.switchLogoutState = this.switchLogoutState.bind(this);
    this.hideLogout = this.hideLogout.bind(this);
  }

  componentWillMount() {
    this.setState({
      showUserOptions: false
    });
  }

  hideLogout() {
    this.setState({
      showUserOptions: false
    });
  }

  switchLogoutState() {
    this.setState({
      showUserOptions: !this.state.showUserOptions
    });
  }

  renderNavigationLink(anchor, path) {
    const linkDisabled = (path === getCurrentLocation());
    const classes = classNames({
      'b-login-info-options-item': true,
      'b-login-info-options-item--disabled': linkDisabled
    });
    const onClick = !linkDisabled ? () => {this.hideLogout();} : () => {};
    return (
      <div className="b-login-info-options__item">
        <Link className={classes} to={path} onClick={onClick}>{anchor}</Link>
      </div>
    );
  }

  renderHeaderLink({refName, anchor, linkSource, linkAction, faIcon}) {
    const clickFunction = linkAction || (() => {
      this.refs[refName].click();
    });
    return (
        <div className="b-header-controls__item">
          <div className="b-header-link" onClick={clickFunction}>
            <div className={`b-header-link__icon fa ${faIcon}`}></div>
            <div className="b-header-link__anchor" >{anchor}</div>
          </div>
          <a ref={refName} className="b-login-info-hidden" href={linkSource}/>
        </div>
    );
  }

  renderAuthInfo() {
    const {userName, token} = this.props;
    if (userName === undefined) {
      return (
          <div className="b-header-controls">
            <div className="b-header-controls__item">
              <div className="b-login-info">
                <div className="b-login-info-loading fa fa-spinner fa-pulse fa-2x"></div>
              </div>
            </div>
          </div>
      );
    }

    const logoutFunction = () => {
      this.refs.logout.click();
    };

    if (userName === null) {
      const loginLink = this.renderHeaderLink({
        refName: 'login',
        anchor: localizeString('HEADER.LOGIN'),
        linkSource: getDashboardLoginUrl(),
        faIcon: 'fa-twitch'
      });
      return (
          <div className="b-header-controls">
            {loginLink}
          </div>
      );
    }

    const donationPageUrl = getPersonalPageUrl({full: false, userName: userName});
    const donationWidgetUrl = getDonationWidgetUrl({token: token, testMode: false});
    const userOptions = !this.state.showUserOptions ? null : (
        <div className="b-login-info__options" >
          <div className="b-login-info-options">
            {this.renderNavigationLink(localizeString('HEADER.DASHBOARD'), `/dashboard`)}
            {this.renderNavigationLink(localizeString('HEADER.DONATION_PAGE'), donationPageUrl)}
            {this.renderNavigationLink(localizeString('HEADER.DONATION_WIDGET'), donationWidgetUrl)}
            <hr className="b-login-info-options__separator"/>
            <div className="b-login-info-options__item">
              <div className="b-login-info-options-item" onClick={logoutFunction}>
                {localizeString('HEADER.LOGOUT')}
              </div>
            </div>
          </div>
          <a ref="logout" className="b-login-info-hidden" href={getLogoutUrl()}/>
        </div>
    );
    const arrowClassNames = classNames({
      'b-header-link__arrow fa': true,
      'fa-caret-down': !this.state.showUserOptions,
      'fa-caret-up': this.state.showUserOptions
    });
    return (
        <div className="b-header-controls">
          <div className="b-no-bem" onMouseLeave={this.hideLogout}>
            <div className="b-header-controls__item">
              <div className="b-login-info">
                <div className="b-header-link" onClick={this.switchLogoutState}>
                  <div className="b-header-link__icon fa fa-user"></div>
                  <div className="b-header-link__anchor">{userName}</div>
                  <div className={arrowClassNames}></div>
                </div>
              </div>
              {userOptions}
            </div>
          </div>
        </div>
    );
  }

  render() {
    return (
        <div className="b-header">
          <a className="b-header__logo" href="/">
            <img className="b-header-logo" src="/resources/images/logo-white.png"/>
          </a>
          <div className="b-header__controls">
            {this.renderAuthInfo()}
          </div>
        </div>
    );
  }
}

Header.propTypes = {
  userName: React.PropTypes.string, // NULLNU
  token: React.PropTypes.string // NULLNU
};

export default class HeaderContainer extends React.Component {
  render() {
    return (
        <AltContainer store={AuthStore}>
          <Header/>
        </AltContainer>
    );
  }
}
