import React from 'react';

export default class InputRange extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.onChange(parseInt(event.target.value, 10));
  }

  render() {
    const {value, min, max, units} = this.props;
    const valueLabel = value + ((!units) ? '' : units);
    // onMouseMove is used only because IE11 doesn't fire onChange
    // onChangeMock is used to avoid react warning in dev-console
    const onChangeMock = () => {};
    return (
        <div className="b-input-range">
          <input className="b-input-range-slider" type="range" min={min} max={max} value={value}
                 onInput={this.onChange} onMouseMove={this.onChange} onChange={onChangeMock}/>
          <div className="b-input-range__label">
            <div className="b-input-range-label">
              {valueLabel}
            </div>
          </div>
        </div>
    );
  }
}

InputRange.propTypes = {
  value: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
  min: React.PropTypes.number.isRequired,
  max: React.PropTypes.number.isRequired,
  units: React.PropTypes.string
};

