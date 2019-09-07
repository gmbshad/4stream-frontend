import React from 'react';

export default class DashboardStatisticsTotal extends React.Component {

  resolveLabel() {
    const lastDigit = this.props.totalNumber % 10;
    const previousDigit = Math.trunc(this.props.totalNumber / 10) % 10;
    if (lastDigit === 1 && previousDigit !== 1) {
      return this.props.labels[0];
    } else if (lastDigit > 1 && lastDigit < 5 && previousDigit !== 1) {
      return this.props.labels[1];
    }
    return this.props.labels[2];
  }

  render() {
    const totalNumber = this.props.totalNumber >= 0 ? this.props.totalNumber : '-';
    const text = `${totalNumber} ${this.resolveLabel()}`;
    return (
      <div className="b-dashboard-statistics-total">
        <div className="b-dashboard-statistics-total__number">
          <div className="b-dashboard-statistics-total-number">
            {text}
          </div>
        </div>
      </div>
    );
  }
}

DashboardStatisticsTotal.propTypes = {
  totalNumber: React.PropTypes.number.isRequired,
  labels: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
};
