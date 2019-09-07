import React from 'react';
import alt from '../../alt';
import ActionListeners from 'alt-utils/lib/ActionListeners';

import SettingsStore from '../../stores/SettingsStore';
import StatisticsStore from '../../stores/StatisticsStore';
import StatisticsActions from '../../actions/StatisticsActions';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import Select from '../../components/Select';
import {DashboardChart, STATISTICS_TYPE} from '../../components/DashboardChart';

import {TIME_INTERVALS, getTimeZoneOffset, addMinutes, copyDate, addDays, addMonths, addYears,
    getStartOfDayUTC, getStartOfWeekUTC, getStartOfMonthUTC, getStartOfYearUTC, formatUTCISODate}
    from '../../utils/DateUtils';
import {localizeString} from '../../localization/LocalizationUtils';


export default class DashboardStatistics extends React.Component {

  constructor(props) {
    super(props);

    this.resetDateToCurrent = this.resetDateToCurrent.bind(this);
    this.shiftDateForward = this.shiftDate.bind(this, 1);
    this.shiftDateBackward = this.shiftDate.bind(this, -1);
    this.updateInterval = this.updateInterval.bind(this);
    this.updateStatisticsType = this.updateStatisticsType.bind(this);
    this.updateShowRemovedDonations = this.updateShowRemovedDonations.bind(this);
    this.requestStatistics = this.requestStatistics.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentWillMount() {
    const timeZone = SettingsStore.getState().timeZone;
    this.setState({
      // it's date where UTC time is equal to local time in TimeZone that user prefers
      utcDate: null,
      timeZone: timeZone,
      timeZoneOffset: getTimeZoneOffset(timeZone),
      interval: TIME_INTERVALS.WEEK,
      intervalStartDate: null,
      intervalEndDate: null,
      statisticsType: STATISTICS_TYPE.DONATION_AMOUNT,
      statistics: null,
      showRemovedDonations: true,
      chartWidth: undefined,
      loadingStatistics: false
    }, this.resetDateToCurrent.bind(this));

    this.actionListener = new ActionListeners(alt);
    this.actionListener.addActionListener(
        StatisticsActions.receiveStatistics.id, () => {
          const statistics = StatisticsStore.getState().statistics;
          this.setState({
            statistics: statistics,
            loadingStatistics: false
          });
        }
    );
    this.actionListener.addActionListener(
        StatisticsActions.receiveStatisticsError.id, () => {
          this.setState({
            statistics: null,
            loadingStatistics: false
          });
        }
    );
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.actionListener.removeAllActionListeners();
  }

  handleResize() {
    const chartWidth = this.refs.barChart.clientWidth;
    this.setState({chartWidth});
  }

  requestStatistics(date, interval, timeZoneOffset, showRemoved) {
    StatisticsActions.requestStatistics.defer({
      date: formatUTCISODate(date),
      interval: interval,
      timeZoneOffset: timeZoneOffset,
      showRemoved: showRemoved
    });
    this.setState({loadingStatistics: true});
  }

  resetDateToCurrent() {
    const currentDate = new Date();
    const utcDate = addMinutes(currentDate, (-1 * this.state.timeZoneOffset));
    this.setState({
      utcDate: utcDate
    });
    this.calculateIntervalAndRequestStatistics(utcDate, this.state.interval);
  }

  calculateIntervalAndRequestStatistics(date, interval) {
    let intervalStart = getStartOfDayUTC(date);
    let intervalEnd = copyDate(intervalStart);
    if (interval === TIME_INTERVALS.DAY) {
      intervalEnd = addDays(intervalStart, 1);
    } else if (interval === TIME_INTERVALS.WEEK) {
      intervalStart = getStartOfWeekUTC(intervalStart);
      intervalEnd = addDays(intervalStart, 7);
    } else if (interval === TIME_INTERVALS.MONTH) {
      intervalStart = getStartOfMonthUTC(intervalStart);
      intervalEnd = addMonths(intervalStart, 1);
    } else if (interval === TIME_INTERVALS.YEAR) {
      intervalStart = getStartOfYearUTC(intervalStart);
      intervalEnd = addYears(intervalStart, 1);
    }
    this.setState({
      intervalStartDate: intervalStart,
      intervalEndDate: intervalEnd
    });
    this.requestStatistics(date, interval, this.state.timeZoneOffset, this.state.showRemovedDonations);
  }

  shiftDate(diff) {
    let newDate = copyDate(this.state.utcDate);
    const interval = this.state.interval;
    if (interval === TIME_INTERVALS.DAY) {
      newDate = addDays(newDate, diff);
    } else if (interval === TIME_INTERVALS.WEEK) {
      newDate = addDays(newDate, 7 * diff);
    } else if (interval === TIME_INTERVALS.MONTH) {
      newDate = addMonths(newDate, diff);
    } else if (interval === TIME_INTERVALS.YEAR) {
      newDate = addYears(newDate, diff);
    }
    this.setState({
      utcDate: newDate
    });
    this.calculateIntervalAndRequestStatistics(newDate, this.state.interval);
  }

  countDonations() {
    const statistics = this.state.statistics;
    const totalNumber = statistics.reduce(
        (previousValue, currentValue) => previousValue + currentValue.numberOfDonations, 0);
    const totalSum = statistics.reduce(
        (previousValue, currentValue) => previousValue + currentValue.totalSum, 0);
    return {totalNumber, totalSum};
  }

  updateInterval(event) {
    const interval = event.target.value;
    this.setState({
      interval: interval
    });
    this.calculateIntervalAndRequestStatistics(this.state.utcDate, interval);
  }

  updateStatisticsType(event) {
    const statisticsType = event.target.value;
    this.setState({
      statisticsType: statisticsType
    });
  }

  updateShowRemovedDonations(showRemovedDonations) {
    this.setState({
      showRemovedDonations: showRemovedDonations
    });
    const {utcDate, interval, timeZoneOffset} = this.state;
    this.requestStatistics(utcDate, interval, timeZoneOffset, showRemovedDonations);
  }

  render() {
    const {statistics, statisticsType, interval, intervalStartDate, intervalEndDate, chartWidth, loadingStatistics,
        showRemovedDonations} = this.state;

    const intervalPickerOptions = [
      {value: TIME_INTERVALS.DAY, label: localizeString('DASHBOARD_STATISTICS.TIME_INTERVALS.DAY')},
      {value: TIME_INTERVALS.WEEK, label: localizeString('DASHBOARD_STATISTICS.TIME_INTERVALS.WEEK')},
      {value: TIME_INTERVALS.MONTH, label: localizeString('DASHBOARD_STATISTICS.TIME_INTERVALS.MONTH')},
      {value: TIME_INTERVALS.YEAR, label: localizeString('DASHBOARD_STATISTICS.TIME_INTERVALS.YEAR')}
    ];
    const intervalPicker = (
      <div className="b-dashboard-statistics-filters__interval-picker">
        <Select value={interval} options={intervalPickerOptions} onChange={this.updateInterval}/>
      </div>
    );

    const statisticsTypeSelectOptions = [
      {value: STATISTICS_TYPE.DONATION_AMOUNT, label:
          localizeString('DASHBOARD_STATISTICS.STATISTICS_TYPE.DONATION_AMOUNT')},
      {value: STATISTICS_TYPE.DONATION_COUNT, label:
          localizeString('DASHBOARD_STATISTICS.STATISTICS_TYPE.DONATION_COUNT')}
    ];
    const statisticsTypeSelect = (
        <div className="b-dashboard-statistics-filters__statistics-type">
          <Select value={statisticsType} options={statisticsTypeSelectOptions} onChange={this.updateStatisticsType}/>
        </div>
    );

    let currentIntervalButtonText = null;
    if (interval === TIME_INTERVALS.DAY) {
      currentIntervalButtonText = localizeString('DASHBOARD_STATISTICS.TIME_INTERVALS_CURRENT.DAY');
    } else if (interval === TIME_INTERVALS.WEEK) {
      currentIntervalButtonText = localizeString('DASHBOARD_STATISTICS.TIME_INTERVALS_CURRENT.WEEK');
    } else if (interval === TIME_INTERVALS.MONTH) {
      currentIntervalButtonText = localizeString('DASHBOARD_STATISTICS.TIME_INTERVALS_CURRENT.MONTH');
    } else if (interval === TIME_INTERVALS.YEAR) {
      currentIntervalButtonText = localizeString('DASHBOARD_STATISTICS.TIME_INTERVALS_CURRENT.YEAR');
    }

    let donationsStats = {
      totalNumber: -1,
      totalSum: -1
    };
    if (statistics !== null) {
      donationsStats = this.countDonations();
    }
    const considerRemovedLabel = localizeString('DASHBOARD_STATISTICS.CONSIDER_REMOVED_DONATIONS');
    return (
        <div>
          <div className="b-dashboard-statistics">
            <div className="b-dashboard-statistics__filters">
              <div className="b-dashboard-statistics-filters">
                {intervalPicker}
                {statisticsTypeSelect}
                <div className="b-dashboard-statistics-filters__removed-donations">
                  <Checkbox id="removedCheckbox" label={considerRemovedLabel} checked={showRemovedDonations}
                            onChange={this.updateShowRemovedDonations}/>
                </div>
              </div>
            </div>
            <div className="b-dashboard-statistics__separator">
            </div>
            <div className="b-dashboard-statistics__navigation">
              <div className="b-dashboard-statistics-navigation">
                <div className="b-dashboard-statistics-navigation__shift-date">
                  <Button text="" onClick={this.shiftDateBackward} fontAwesomeClass="fa-chevron-left"/>
                </div>
                <div className="b-dashboard-statistics-navigation__shift-date">
                  <Button text="" onClick={this.shiftDateForward} fontAwesomeClass="fa-chevron-right"/>
                </div>
                <div className="b-dashboard-statistics-navigation__reset-date">
                  <Button text={currentIntervalButtonText} onClick={this.resetDateToCurrent}/>
                </div>
              </div>
            </div>
            <div ref="barChart" className="b-dashboard-statistics__chart">
              <DashboardChart statistics={statistics} statisticsType={statisticsType} interval={interval}
                  width={chartWidth} loadingStatistics={loadingStatistics} intervalStartDate={intervalStartDate}
                  intervalEndDate={intervalEndDate} donationsStats={donationsStats}/>
            </div>
          </div>
        </div>
    );
  }
}
