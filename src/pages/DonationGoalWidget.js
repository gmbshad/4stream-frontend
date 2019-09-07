import React from 'react';
import alt from '../alt';
import ActionListeners from 'alt-utils/lib/ActionListeners';

import {localizeString} from '../localization/LocalizationUtils';
import DonationGoalActions from '../actions/DonationGoalActions';
import DonationWidget from './DonationWidget';
import DonationGoal from '../components/DonationGoal';

const UPDATE_WIDGET_MESSAGE = 'UPDATE';

export default class DonationGoalWidget extends DonationWidget {

  constructor(props) {
    super(props);

    this.updateData = this.updateData.bind(this);
  }

  componentWillMount() {
    super.componentWillMount();

    this.setState({
      settings: null,
      activeDonationGoal: null
    });

    this.actionListener = new ActionListeners(alt);
    this.actionListener.addActionListener(
        DonationGoalActions.receiveWidgetData.id, (data) => {
          this.setState({
            settings: data.settings,
            activeDonationGoal: data.activeDonationGoal
          });
        }
    );
    this.actionListener.addActionListener(
        DonationGoalActions.receiveWidgetDataError.id, (error) => {
          console.log(error);
        }
    );
  }

  clearResources() {
    super.clearResources();

    this.actionListener.removeAllActionListeners();
  }

  updateData() {
    DonationGoalActions.requestWidgetData.defer(this.getToken());
  }

  onConnectionEstablished() {
    this.updateData();
  }

  onSettingsReload() {
    this.updateData();
  }

  onMessage(message) {
    if (message === UPDATE_WIDGET_MESSAGE) {
      this.updateData();
    } else {
      console.warn('Unexpected message');
    }
  }

  getClientType() {
    return 'donationGoal';
  }

  renderNoActiveGoalRemark() {
    return (
        <div className="b-donation-goal-widget__remark">
          <div className="b-donation-goal-widget-remark">
            {localizeString('DONATION_GOAL_WIDGET.NO_ACTIVE')}
          </div>
        </div>
    );
  }
  
  render() {
    const {settings, activeDonationGoal} = this.state;
    if (settings === null) {
      return null;
    }
    let donationGoal = null;
    if (activeDonationGoal === null) {
      donationGoal = this.renderNoActiveGoalRemark();
    } else {
      const {title, goalAmount, currentAmount, endDate} = activeDonationGoal;
      donationGoal = (
          <DonationGoal title={title} goalAmount={goalAmount} currentAmount={currentAmount}
                        endDate={endDate} settings={settings}/>
      );
    }

    return (
        <div className="b-donation-goal-widget">
          {donationGoal}
        </div>
    );
  }
}
