import React from 'react';

export default class DashboardSettingsOption extends React.Component {
  
  renderTooltip() {
    const {tooltip} = this.props;
    if (tooltip === undefined) {
      return null;
    }
    return (
      <div className="b-dashboard-settings-option__tooltip">
        {tooltip}
      </div>
    );
  }
  
  render() {
    const label = this.props.label ? this.props.label + ':' : '';
    return (
      <div className="b-dashboard-settings-option">
        <div className="b-dashboard-settings-option__label">
          <div className="b-dashboard-settings-option-label">
            <div className="b-dashboard-settings-option-label__text">
              {label}
            </div>
            <div className="b-dashboard-settings-option-label__tooltip">
              {this.renderTooltip()}
            </div>
          </div>
        </div>
        <div className="b-dashboard-settings-option__value">
          <div className="b-dashboard-settings-option-value">
            {this.props.value}
          </div>
        </div>
      </div>
    );
  }
}

DashboardSettingsOption.propTypes = {
  label: React.PropTypes.string,
  value: React.PropTypes.element.isRequired,
  tooltip: React.PropTypes.element
};
