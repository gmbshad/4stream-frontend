import React from 'react';

import SidebarItem from './SidebarItem';
import {localizeString} from '../localization/LocalizationUtils';

export default class Sidebar extends React.Component {


  render() {
    return (
      <div className="b-dashboard-sidebar">
        <SidebarItem label={localizeString('SIDEBAR.NEWS')} route="/dashboard/news"/>
        <SidebarItem label={localizeString('SIDEBAR.DONATIONS')} route="/dashboard/donations"/>
        <SidebarItem label={localizeString('SIDEBAR.SETTINGS')} route="/dashboard/settings"/>
        <SidebarItem label={localizeString('SIDEBAR.WIDGETS')} route="/dashboard/widgets"/>
        <SidebarItem label={localizeString('SIDEBAR.SUPPORT_SERVICE')} route="/dashboard/donate"/>
      </div>
    );
  }
}
