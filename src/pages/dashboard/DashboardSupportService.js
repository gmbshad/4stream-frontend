import React from 'react';
import classNames from 'classnames';

import {DashboardContent} from './DashboardContent';
import {localizeString} from '../../localization/LocalizationUtils';
import Constants from '../../utils/Constants';

export default class DashboardSupportService extends DashboardContent {

  getHeader() {
    return localizeString('DASHBOARD_SUPPORT_SERVICE.TITLE');
  }

  renderSupportOption(faClass, parts) {
    const renderedDescription = parts.map((part, index) => {
      let text = `${part.text}`;
      const isLink = (part.link !== null);
      if (isLink) {
        text = (
            <a className="b-dashboard-support-service-option-description-link" href={part.link} target="_blank">{text}</a>
        );
      }
      const classes = classNames({
        'b-dashboard-support-service-option-description-part': true,
        'b-dashboard-support-service-option-description-part--link': isLink
      });
      return (
        <span key={`part_${index}`} className="b-dashboard-support-service-option-description__part">
          <span className={classes}>
            {text}&nbsp;
          </span>
        </span>
      );
    });
    return (
        <div className="b-dashboard-support-service-options__item">
          <div className="b-dashboard-support-service-option">
            <div className="b-dashboard-support-service-option__icon">
              <div className={`b-dashboard-support-service-option-icon fa fa-2x ${faClass}`}/>
            </div>
            <span className="b-dashboard-support-service-option-description">
              {renderedDescription}
            </span>
          </div>
        </div>
    );
  }

  renderContent() {
    const vkParts = [
      {
        link: null,
        text: localizeString('DASHBOARD_SUPPORT_SERVICE.VK_GROUP_1')
      },
      {
        link: Constants.VK_GROUP_LINK,
        text: localizeString('DASHBOARD_SUPPORT_SERVICE.VK_GROUP_2')
      },
      {
        link: null,
        text: localizeString('DASHBOARD_SUPPORT_SERVICE.VK_GROUP_3')
      }
    ];
    const twitterParts = [
      {
        link: null,
        text: localizeString('DASHBOARD_SUPPORT_SERVICE.TWITTER_1')
      },
      {
        link: Constants.TWITTER_LINK,
        text: localizeString('DASHBOARD_SUPPORT_SERVICE.TWITTER_2')
      },
    ];
    const shareParts = [
      {
        link: null,
        text: localizeString('DASHBOARD_SUPPORT_SERVICE.SHARE_1')
      },
    ];
    const donateParts = [
      {
        link: null,
        text: localizeString('DASHBOARD_SUPPORT_SERVICE.DONATE_1')
      },
      {
        link: `${Constants.DONATION_PAGE_URL_FULL}/${Constants.STREAM_ASSIST_TWITCH_LOGIN}`,
        text: localizeString('DASHBOARD_SUPPORT_SERVICE.DONATE_2')
      },
    ];
    return (
      <div className="b-dashboard-support-service">
        <div className="b-dashboard-support-service__separator">
        </div>
        <div className="b-dashboard-support-service__options">
          <div className="b-dashboard-support-service-options">
            {this.renderSupportOption('fa-vk', vkParts)}
            {this.renderSupportOption('fa-twitter', twitterParts)}
            {this.renderSupportOption('fa-share', shareParts)}
            {this.renderSupportOption('fa-money', donateParts)}
          </div>
        </div>
      </div>
    );
  }
}
