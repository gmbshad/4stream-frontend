import React from 'react';

import DashboardSettingsOption from './DashboardSettingsOption';
import DashboardSettingsForm from './DashboardSettingsForm';
import Constants from '../../utils/Constants';
import {INPUT_NO_VALUE} from '../../utils/Constants';
import Tooltip from '../../components/Tooltip';
import Select from '../../components/Select';
import TextArea from '../../components/TextArea';
import {getPersonalPageUrl} from '../../utils/UrlUtils';
import {localizeString} from '../../localization/LocalizationUtils';
import DashboardInputWithAction from './DashboardInputWithAction';


const SHOW_TWITCH_STREAM_STATUS = {
  YES: 'yes',
  NO: 'no'
};

class DashboardSettingsDonationPageForm extends DashboardSettingsForm {

  constructor(props) {
    super(props);
    this.updateShowTwitchStreamStatus = this.updateShowTwitchStreamStatus.bind(this);
    this.updateDonationPageText = this.updateDonationPageText.bind(this);
  }

  updateStateFromStore(settingsStoreState) {
    this.setState({
      showTwitchStreamStatus: settingsStoreState.showTwitchStreamStatus,
      donationPageText: settingsStoreState.donationPageText
    });
  }

  updateShowTwitchStreamStatus(event) {
    this.setState({
      showTwitchStreamStatus: event.target.value === SHOW_TWITCH_STREAM_STATUS.YES
    });
  }

  updateDonationPageText(event) {
    this.setState({
      donationPageText: event.target.value ? event.target.value : null
    });
  }

  render() {
    const personalPageURLFull = getPersonalPageUrl({full: true, userName: this.props.authStore.userName});
    const personalPageLink = (
        <DashboardInputWithAction value={personalPageURLFull}/>
    );

    const showStatusTooltipText = localizeString('DASHBOARD_SETTINGS_DONATION_PAGE.STREAM_STATUS_TOOLTIP');
    const showStatusTooltip = (
        <Tooltip id="showStatusTooltip" text={showStatusTooltipText}/>
    );

    const showTwitchStreamStatusValue = this.state.showTwitchStreamStatus
        ? SHOW_TWITCH_STREAM_STATUS.YES
        : SHOW_TWITCH_STREAM_STATUS.NO;
    const showTwitchStreamStatusOptions = [
      {
        value: SHOW_TWITCH_STREAM_STATUS.YES,
        label: localizeString('DASHBOARD_SETTINGS_DONATION_PAGE.SHOW_TWITCH_STREAM_STATUS_YES')
      },
      {
        value: SHOW_TWITCH_STREAM_STATUS.NO,
        label: localizeString('DASHBOARD_SETTINGS_DONATION_PAGE.SHOW_TWITCH_STREAM_STATUS_NO')
      }
    ];
    const showTwitchStreamStatusSelect = (
        <Select value={showTwitchStreamStatusValue} options={showTwitchStreamStatusOptions}
                onChange={this.updateShowTwitchStreamStatus} smallFont/>
    );

    const donationPageText = localizeString('DASHBOARD_SETTINGS_DONATION_PAGE.DONATION_PAGE_TOOLTIP');
    const donationPageTextTooltip = (
        <Tooltip id="donationPageTextTooltip" text={donationPageText}/>
    );
    const donationPageTextInput = (
        <TextArea rowNumber={4} value={this.state.donationPageText || INPUT_NO_VALUE} smallFont fillParent
                  maxLength={Constants.MAX_DONATION_PAGE_TEXT_LENGTH} onChange={this.updateDonationPageText} />
    );

    const donationPageLabel = localizeString('DASHBOARD_SETTINGS_DONATION_PAGE.DONATION_PAGE_LABEL');
    const streamStatusLabel = localizeString('DASHBOARD_SETTINGS_DONATION_PAGE.STREAM_STATUS_LABEL');
    const donationPageTextLabel = localizeString('DASHBOARD_SETTINGS_DONATION_PAGE.DONATION_PAGE_TEXT_LABEL');
    return (
        <div className="b-dashboard-settings-form">
          {this.renderHeader(localizeString('DASHBOARD_SETTINGS_DONATION_PAGE.TITLE'))}
          {this.renderSeparator()}
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={donationPageLabel} value={personalPageLink}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={streamStatusLabel} value={showTwitchStreamStatusSelect}
                tooltip={showStatusTooltip}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={donationPageTextLabel} value={donationPageTextInput}
                tooltip={donationPageTextTooltip}/>
          </div>
          {this.renderSaveButton()}
        </div>
    );
  }
}

class DashboardSettingsDonationPage extends React.Component {
  render() {
    return (
        <div className="b-dashboard-category-content">
          <div className="b-dashboard-category-content__part b-dashboard-category-content__part--margin-bottom">
            <DashboardSettingsDonationPageForm authStore={this.props.authStore}/>
          </div>
        </div>
    );
  }
}

DashboardSettingsDonationPage.propTypes = Object.assign({}, DashboardSettingsForm.propTypes, {
  authStore: React.PropTypes.shape({
    userName: React.PropTypes.string.isRequired // NULLNU
  }).isRequired
});

export default DashboardSettingsDonationPage;
