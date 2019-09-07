import React from 'react';
import AltContainer from 'alt-container';

import UserActions from '../../actions/UserActions';
import UserStore from '../../stores/UserStore';
import {DashboardContent} from './DashboardContent';
import {localizeString} from '../../localization/LocalizationUtils';
import Constants from '../../utils/Constants';

class DashboardPromo extends DashboardContent {

  componentDidMount() {
    UserActions.requestPromoActionParticipators.defer();
  }
  
  getHeader() {
    return localizeString('DASHBOARD_PROMO.TITLE');
  }

  renderListItem(text, iconType, href) {
    const iconClass = (iconType === undefined) ? 'fa-hand-o-right' : iconType;
    const icon = <div className={`b-dashboard-promo-list-item__icon fa ${iconClass}`}/>;
    const content = (
        <div className="b-dashboard-promo-list-item__content">
          {text}
        </div>
    );
    if (href === undefined) {
      return (
          <div className="b-dashboard-promo-list__item">
            <div className="b-dashboard-promo-list-item">
              {icon}
              {content}
            </div>
          </div>
      );
    }
    return (
      <div className="b-dashboard-promo-list__item">
        <a className="b-dashboard-promo-list-item b-dashboard-promo-list-item--link" href={href} target="_blank">
          {icon}
          {content}
        </a>
      </div>
    );
  }

  renderContent() {
    const users = this.props.users || [];
    const usersElements = users.map((user) => (
        <div className="b-dashboard-promo-list__user" key={user.userId}>
            {this.renderListItem((
              <span className="b-dashboard-promo-list-item-content">
                {user.userName}
              </span>),
              'fa-twitch',
              `${Constants.TWITCH_URL}/${user.userName}`)
            }
          </div>
    ));

    const vkJoinListItem = (
        <div className="b-dashboard-promo-list-item-content">
          <div className="b-dashboard-promo-list-item-content__part">
            {localizeString('DASHBOARD_PROMO.TEXT_7')}
          </div>
          <div className="b-dashboard-promo-list-item-content__part">
            <a className="b-dashboard-promo-link" href={Constants.VK_GROUP_LINK}>
              {localizeString('DASHBOARD_PROMO.TEXT_8')}
            </a>
          </div>
        </div>
    );

    const discussionCommentListItem = (
        <div className="b-dashboard-promo-list-item-content">
          <div className="b-dashboard-promo-list-item-content__part">
            {localizeString('DASHBOARD_PROMO.TEXT_9')}
          </div>
          <div className="b-dashboard-promo-list-item-content__part">
            <a className="b-dashboard-promo-link" href={Constants.VK_PROMO_DISCUSSION_LINK}>
              {localizeString('DASHBOARD_PROMO.TEXT_10')}
            </a>
          </div>
          <div className="b-dashboard-promo-list-item-content__part">
            &nbsp;{localizeString('DASHBOARD_PROMO.TEXT_11')}
          </div>
        </div>
    );

    return (
      <div className="b-dashboard-promo">
        <div className="b-dashboard-promo-overview">
          {localizeString('DASHBOARD_PROMO.TEXT')}
        </div>
        <div className="b-dashboard-promo__gift-icon">
          <div className="b-dashboard-promo-gift-icon fa fa-gift fa-4x"/>
        </div>
        <div className="b-dashboard-promo__question">
          <div className="b-dashboard-promo-question">
            {localizeString('DASHBOARD_PROMO.TEXT_2')}
          </div>
        </div>
        <div className="b-dashboard-promo-list">
          {this.renderListItem(localizeString('DASHBOARD_PROMO.TEXT_3'))}
          {this.renderListItem(localizeString('DASHBOARD_PROMO.TEXT_4'))}
        </div>
        <div className="b-dashboard-promo__question">
          <div className="b-dashboard-promo-question">
            {localizeString('DASHBOARD_PROMO.TEXT_5')}
          </div>
        </div>
        <div className="b-dashboard-promo-list">
          {this.renderListItem(localizeString('DASHBOARD_PROMO.TEXT_6'))}
          {this.renderListItem(vkJoinListItem)}
          {this.renderListItem(discussionCommentListItem)}
        </div>
        <div className="b-dashboard-promo__question">
          <div className="b-dashboard-promo-question">
            {localizeString('DASHBOARD_PROMO.TEXT_12')}
          </div>
        </div>
        <div className="b-dashboard-promo-list">
          {this.renderListItem(localizeString('DASHBOARD_PROMO.TEXT_13'))}
        </div>
        <div className="b-dashboard-promo-overview">
          {localizeString('DASHBOARD_PROMO.TEXT_PARTICIPANTS')}
        </div>
        <div className="b-dashboard-promo__participants">
          <div className="b-dashboard-promo-participants">
            <div className="b-dashboard-promo-list">
              {usersElements}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default class DashboardPromoContainer extends React.Component {
  render() {
    return (
        <AltContainer store={UserStore}>
          <DashboardPromo {...this.props}/>
        </AltContainer>
    );
  }
}
