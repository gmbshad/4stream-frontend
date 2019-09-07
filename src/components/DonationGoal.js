import React from 'react';
import {sprintf} from 'sprintf-js';

import {localizeString} from '../localization/LocalizationUtils';
import {differenceInDaysFromNow} from '../utils/DateUtils';
import {FONT_SETTINGS_TYPE} from '../utils/Types';
import StyledText from './StyledText';
import Constants from '../utils/Constants';

export default class DonationGoal extends React.Component {

  renderEndDate() {
    const {endDate} = this.props;
    let daysCounterString = '';
    if (endDate !== null) {
      const diff = differenceInDaysFromNow(this.props.endDate);
      if (diff > 0) {
        daysCounterString = sprintf(localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.DAYS_LEFT'), diff);
      }
    }
    return daysCounterString;
  }

  calculatePercents(currentAmount, goalAmount) {
    if (currentAmount > goalAmount) {
      return '100%';
    }
    const amountDouble = (100 * currentAmount / goalAmount).toFixed(2);
    return `${amountDouble}%`;
  }

  render() {
    const {title, settings, currentAmount, goalAmount} = this.props;
    const indicatorStyle = {
      height: settings.barThickness + 'px',
    };
    const indicatorGoalStyle = {
      height: settings.barThickness + 'px',
      backgroundColor: settings.barBackgroundColor,
      borderRadius: '5px',
    };
    const indicatorCurrentStyle = {
      height: settings.barThickness + 'px',
      width: this.calculatePercents(currentAmount, goalAmount),
      backgroundColor: settings.barColor,
      borderRadius: '5px'
    };
    const barText = `${currentAmount}${Constants.RUBLE} (${this.calculatePercents(currentAmount, goalAmount)})`;
    return (
        <div className="b-donation-goal">
          <div className="b-donation-goal-title">
            <StyledText text={title} fontSettings={settings.titleFontSettings}/>
          </div>
          <div className="b-donation-goal__indicator">
            <div className="b-donation-goal-indicator" style={indicatorStyle}>
              <div className="b-donation-goal-indicator__container">
                <div className="b-donation-goal-indicator-goal" style={indicatorGoalStyle}/>
              </div>
              <div className="b-donation-goal-indicator__container">
                <div className="b-donation-goal-indicator-current" style={indicatorCurrentStyle}/>
              </div>
              <div className="b-donation-goal-indicator__text">
                <div className="b-donation-goal-indicator-text">
                  <StyledText text={barText} fontSettings={settings.barTextFontSettings}/>
                </div>
              </div>
            </div>
          </div>
          <div className="b-donation-goal-amount-and-date">
            <div className="b-donation-goal-amount-and-date__item">
              <StyledText text={this.renderEndDate()} fontSettings={settings.remainingFontSettings}/>
            </div>
            <div className="b-donation-goal-amount-and-date__item">
              <div className="b-donation-goal-amount">
                <StyledText text={`${goalAmount}${Constants.RUBLE}`} fontSettings={settings.totalFontSettings}/>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

DonationGoal.propTypes = {
  title: React.PropTypes.string.isRequired,
  goalAmount: React.PropTypes.number.isRequired,
  currentAmount: React.PropTypes.number.isRequired,
  endDate: React.PropTypes.string,
  settings: React.PropTypes.shape({
    barThickness: React.PropTypes.number.isRequired,
    barColor: React.PropTypes.string.isRequired,
    barBackgroundColor: React.PropTypes.string.isRequired,
    titleFontSettings: FONT_SETTINGS_TYPE.isRequired,
    barTextFontSettings: FONT_SETTINGS_TYPE.isRequired,
    remainingFontSettings: FONT_SETTINGS_TYPE.isRequired,
    totalFontSettings: FONT_SETTINGS_TYPE.isRequired
  }).isRequired
};

