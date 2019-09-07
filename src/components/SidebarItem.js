import React from 'react';
import classNames from 'classnames';

import {getCurrentLocation, navigateTo} from '../utils/NavigationUtils';

const SIDEBAR_ITEM_ICON = {
  GIFT: 'gift'
};

export default class SidebarItem extends React.Component {

  constructor(props) {
    super(props);

    this.processNavigation = this.processNavigation.bind(this);
    this.isItemActive = this.isItemActive.bind(this);
  }

  processNavigation() {
    navigateTo(this.props.route);
  }

  isItemActive() {
    return (getCurrentLocation().startsWith(this.props.route));
  }

  getIconClasses(icon) {
    if (icon === SIDEBAR_ITEM_ICON.GIFT) {
      return classNames({
        'b-dashboard-sidebar-item__icon': true,
        'b-dashboard-sidebar-item__icon--red': true,
        'fa fa-gift fa-lg': true
      });
    }
    return classNames('b-dashboard-sidebar-item__icon');
  }

  render() {
    let className = 'b-dashboard-sidebar__item ';
    if (this.isItemActive()) {
      className = className + 'b-dashboard-sidebar__item--active';
    }
    return (
        <div className={className} onClick={this.processNavigation}>
          <div className="b-dashboard-sidebar-item">
            <div className="b-dashboard-sidebar-item__text">
              {this.props.label}
            </div>
            <div className={this.getIconClasses(this.props.icon)}>
            </div>
          </div>
        </div>
    );
  }
}

SidebarItem.propTypes = {
  label: React.PropTypes.string.isRequired,
  route: React.PropTypes.string.isRequired,
  icon: React.PropTypes.oneOf(Object.keys(SIDEBAR_ITEM_ICON).map(key => SIDEBAR_ITEM_ICON[key]))
};

export {SIDEBAR_ITEM_ICON};
