import React from 'react';

import Select from './Select';
import {localizeString} from '../localization/LocalizationUtils';

const AUTO_TIME_ZONE_VALUE = 'auto';
const TIME_ZONES_MAP = new Map();
TIME_ZONES_MAP.set(AUTO_TIME_ZONE_VALUE, localizeString('TIMEZONES.AUTO'));
TIME_ZONES_MAP.set('Europe/Kaliningrad', localizeString('TIMEZONES.GMT_PLUS_2'));
TIME_ZONES_MAP.set('Europe/Moscow', localizeString('TIMEZONES.GMT_PLUS_3'));
TIME_ZONES_MAP.set('Europe/Samara', localizeString('TIMEZONES.GMT_PLUS_4'));
TIME_ZONES_MAP.set('Asia/Yekaterinburg', localizeString('TIMEZONES.GMT_PLUS_5'));
TIME_ZONES_MAP.set('Asia/Omsk', localizeString('TIMEZONES.GMT_PLUS_6'));
TIME_ZONES_MAP.set('Asia/Krasnoyarsk', localizeString('TIMEZONES.GMT_PLUS_7'));
TIME_ZONES_MAP.set('Asia/Irkutsk', localizeString('TIMEZONES.GMT_PLUS_8'));
TIME_ZONES_MAP.set('Asia/Yakutsk', localizeString('TIMEZONES.GMT_PLUS_9'));
TIME_ZONES_MAP.set('Asia/Vladivostok', localizeString('TIMEZONES.GMT_PLUS_10'));
TIME_ZONES_MAP.set('Asia/Magadan', localizeString('TIMEZONES.GMT_PLUS_11'));
TIME_ZONES_MAP.set('Asia/Kamchatka', localizeString('TIMEZONES.GMT_PLUS_12'));
const TIME_ZONES_ARRAY = Array.from(TIME_ZONES_MAP).map(([value, label]) => ({ value, label }));

export default class TimeZonePicker extends React.Component {

  constructor(props) {
    super(props);
    this.updateValue = this.updateValue.bind(this);
  }

  updateValue(event) {
    const nextValue = event.target.value;
    const nextValueExternal = (nextValue !== AUTO_TIME_ZONE_VALUE) ? nextValue : null;
    this.props.onChange(nextValueExternal);
  }

  render() {
    const adjustedValue = this.props.value || AUTO_TIME_ZONE_VALUE;
    return (
        <div className="b-time-zone-picker">
          <Select value={adjustedValue} onChange={this.updateValue} options={TIME_ZONES_ARRAY} smallFont/>
        </div>
    );
  }
}

TimeZonePicker.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired
};


