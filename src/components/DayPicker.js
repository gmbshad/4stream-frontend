import React from 'react';
import DatePicker from 'react-datepicker';

import {getMoment, getMomentFromDate} from '../utils/DateUtils';

const DATE_FORMAT = 'YYYY-MM-DD';

export default class DayPicker extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.setState({
      creationDate: getMoment()
    });
  }

  handleChange(date) {
    const value = (date !== null) ? date.format(DATE_FORMAT) : null;
    this.props.onChange(value);
  }

  render() {
    const {value, placeHolder} = this.props;
    const date = (value !== null) ? getMomentFromDate(value, DATE_FORMAT) : null;
    return (
        <DatePicker selected={date} onChange={this.handleChange} placeholderText={placeHolder} isClearable
                    dateFormat={DATE_FORMAT} minDate={this.state.creationDate}/>
    );
  }
}

DayPicker.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  placeHolder: React.PropTypes.string
};

