import React from 'react';
import Bar from 'react-chartjs/lib/bar';
import {sprintf} from 'sprintf-js';

import DashboardStatisticsTotal from './DashboardStatisticsTotal';
import {TIME_INTERVALS, DAYS_OF_WEEK, DAYS_OF_WEEK_SHORT, MONTHS_OF_YEAR, MONTHS_OF_YEAR_SHORT} from '../utils/DateUtils';
import {calculateHeightAndSteps} from '../utils/ChartUtils';
import {formatUTCDate} from '../utils/DateUtils';
import {localizeString} from '../localization/LocalizationUtils';

const CHART_MIN_HEIGHT = 250;
const CHART_HEIGHT_PROPORTION = 0.25;
const SHORT_LABELS_WIDTH = 700;
const CHART_SIDE_MARGIN = 30;

const STATISTICS_TYPE = {
  DONATION_AMOUNT: 'donationAmount',
  DONATION_COUNT: 'donationCount'
};

class DashboardStatisticsMeta extends React.Component {

  shouldComponentUpdate(nextProps) {
    return !nextProps.loadingStatistics;
  }

  renderIntervalString() {
    const {interval, intervalStart, intervalEnd} = this.props;
    if (intervalStart === null || intervalEnd === null) {
      return null;
    }

    let intervalStr = null;
    if (interval === TIME_INTERVALS.DAY) {
      intervalStr = formatUTCDate(intervalStart);
    } else if (interval === TIME_INTERVALS.WEEK) {
      intervalStr = sprintf(localizeString('DASHBOARD_CHART.TIME_INTERVAL'),
          formatUTCDate(intervalStart), formatUTCDate(intervalEnd));
    } else if (interval === TIME_INTERVALS.MONTH) {
      intervalStr = formatUTCDate(intervalStart, true);
      intervalStr = intervalStr.charAt(0).toUpperCase() + intervalStr.slice(1);
    } else if (interval === TIME_INTERVALS.YEAR) {
      intervalStr = sprintf('%d %s', intervalStart.getUTCFullYear(), localizeString('DASHBOARD_CHART.YEAR_LABEL'));
    }
    return intervalStr;
  }

  render() {
    const {donationsStats, statisticsType} = this.props;

    const totalNumberLabels = [
      localizeString('DASHBOARD_CHART.DONATION_TOTAL_NUMBER.ONE'),
      localizeString('DASHBOARD_CHART.DONATION_TOTAL_NUMBER.SEVERAL'),
      localizeString('DASHBOARD_CHART.DONATION_TOTAL_NUMBER.MANY')];
    const totalSumLabels = [
      localizeString('DASHBOARD_CHART.DONATION_TOTAL_AMOUNT_RUBLES.ONE'),
      localizeString('DASHBOARD_CHART.DONATION_TOTAL_AMOUNT_RUBLES.SEVERAL'),
      localizeString('DASHBOARD_CHART.DONATION_TOTAL_AMOUNT_RUBLES.MANY')];

    const totalElement = (statisticsType === STATISTICS_TYPE.DONATION_COUNT) 
        ? <DashboardStatisticsTotal totalNumber={donationsStats.totalNumber} labels={totalNumberLabels}/>
        : <DashboardStatisticsTotal totalNumber={donationsStats.totalSum} labels={totalSumLabels}/>;
    return (
        <div className="b-dashboard-statistics-meta">
          <div className="b-dashboard-statistics-meta__interval">
            <div className="b-dashboard-statistics-meta-interval">
              {this.renderIntervalString()}
            </div>
          </div>
          <div className="b-dashboard-statistics-meta__separator">
            <div className="b-dashboard-statistics-meta-separator">
              {'-'}
            </div>
          </div>
          <div className="b-dashboard-statistics-meta__total">
            <div className="b-dashboard-statistics-meta-total">
              <div className="b-dashboard-statistics-meta-total__item">
                {totalElement}
              </div>
            </div>
          </div>
        </div>
    );
  }
}


DashboardStatisticsMeta.propTypes = {
  loadingStatistics: React.PropTypes.bool.isRequired,
  interval: React.PropTypes.oneOf(Object.keys(TIME_INTERVALS).map(key => TIME_INTERVALS[key])).isRequired,
  intervalStart: React.PropTypes.object,
  intervalEnd: React.PropTypes.object,
  donationsStats: React.PropTypes.shape({
    totalNumber: React.PropTypes.number.isRequired,
    totalSum: React.PropTypes.number.isRequired
  }),
  statisticsType: React.PropTypes.oneOf([STATISTICS_TYPE.DONATION_COUNT, STATISTICS_TYPE.DONATION_AMOUNT]),
};

class DashboardChart extends React.Component {

  shouldComponentUpdate(nextProps) {
    return !nextProps.loadingStatistics;
  }

  generateLabels() {
    const useShortLabels = this.props.width <= SHORT_LABELS_WIDTH;
    const interval = this.props.interval;
    const numberOfPoints = this.props.statistics.length;
    if (interval === TIME_INTERVALS.DAY) {
      return Array.from(new Array(24), (element, index) => {
        const hour = index < 10 ? '0' + index : index;
        return !useShortLabels ? `${hour}:00` : hour;
      });
    } else if (interval === TIME_INTERVALS.WEEK) {
      return !useShortLabels ? DAYS_OF_WEEK : DAYS_OF_WEEK_SHORT;
    } else if (interval === TIME_INTERVALS.MONTH) {
      return Array.from(new Array(numberOfPoints), (element, index) => index + 1);
    } else if (interval === TIME_INTERVALS.YEAR) {
      return !useShortLabels ? MONTHS_OF_YEAR : MONTHS_OF_YEAR_SHORT;
    }
    return [];
  }

  extractData() {
    const statistics = this.props.statistics;
    const statisticsType = this.props.statisticsType;
    if (statisticsType === STATISTICS_TYPE.DONATION_AMOUNT) {
      return statistics.map(element => element.totalSum);
    }
    return statistics.map(element => element.numberOfDonations);
  }

  getTooltipTemplate() {
    // how to avoid copy-paste in templates?
    const labelSuffix = (this.props.interval === TIME_INTERVALS.MONTH)
        ? localizeString('DASHBOARD_CHART.TOOLTIP_DAY') : '';
    const units = (this.props.statisticsType !== STATISTICS_TYPE.DONATION_AMOUNT)
        ? localizeString('DASHBOARD_CHART.TOOLTIP_NUMBER') : localizeString('DASHBOARD_CHART.TOOLTIP_RUBLE');
    return sprintf("<%%=label%%>%s: <%%= value + ' %s' %%>", labelSuffix, units);
  }

  render() {
    const {statistics, width, interval, loadingStatistics, donationsStats, 
        intervalStartDate, intervalEndDate, statisticsType} = this.props;
    if (statistics === null || width === undefined) {
      return null;
    }
    const labels = this.generateLabels();
    const data = this.extractData();

    const max = Math.max(0, Math.max(...data));
    const {height, steps} = calculateHeightAndSteps(max);
    const barValueSpacing = (interval === TIME_INTERVALS.MONTH || interval === TIME_INTERVALS.DAY) ? 2 : 5;
    const chartOptions = {
      animation: false,

      tooltipFillColor: '#333',
      tooltipFontColor: '#eee',
      tooltipFontFamily: '"Ubuntu", sans-serif',
      tooltipTemplate: this.getTooltipTemplate(),

      scaleShowGridLines: true,
      scaleGridLineColor: 'rgba(210,210,210,0.3)',
      scaleFontColor: '#555',
      scaleFontFamily: '"Ubuntu", sans-serif',
      scaleLineColor: '#999',
      scaleOverride: true,
      scaleSteps: steps,
      scaleStartValue: 0,
      scaleStepWidth: Math.round(height / steps),

      barValueSpacing: barValueSpacing
    };
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Donation statistics',
          fillColor: 'rgba(52,152,219,0.75)',
          strokeColor: '#2980b9',
          data: data
        }
      ]
    };
    const widthMinusMargin = width - CHART_SIDE_MARGIN;
    const heightPixels = Math.max(CHART_MIN_HEIGHT, widthMinusMargin * CHART_HEIGHT_PROPORTION);
    // this shitty library (react-chartjs) handles resizing incorrectly, 
    // that's why we force recreating component(key prop)
    return (
        <div className="b-dashboard-chart">
          <div className="b-dashboard-chart__content">
            <div className="b-dashboard-chart-meta">
              <DashboardStatisticsMeta loadingStatistics={loadingStatistics} donationsStats={donationsStats}
                  interval={interval} intervalStart={intervalStartDate} intervalEnd={intervalEndDate}
                  statisticsType={statisticsType}/>
            </div>
            <Bar key={widthMinusMargin} data={chartData} options={chartOptions} width={widthMinusMargin}
                 height={heightPixels} redraw/>
          </div>
        </div>
    );
  }
}

DashboardChart.propTypes = {
  width: React.PropTypes.number,
  loadingStatistics: React.PropTypes.bool.isRequired,
  statistics: React.PropTypes.arrayOf(React.PropTypes.shape({
    startPeriod: React.PropTypes.string.isRequired,
    numberOfDonations: React.PropTypes.number.isRequired,
    totalSum: React.PropTypes.number.isRequired
  })),
  statisticsType: React.PropTypes.oneOf([STATISTICS_TYPE.DONATION_COUNT, STATISTICS_TYPE.DONATION_AMOUNT]),
  interval: React.PropTypes.oneOf([TIME_INTERVALS.DAY, TIME_INTERVALS.WEEK, TIME_INTERVALS.MONTH, TIME_INTERVALS.YEAR])
      .isRequired,
  intervalStartDate: React.PropTypes.object,
  intervalEndDate: React.PropTypes.object,
  donationsStats: React.PropTypes.shape({
    totalNumber: React.PropTypes.number.isRequired,
    totalSum: React.PropTypes.number.isRequired
  })
};

export {DashboardChart, STATISTICS_TYPE};


