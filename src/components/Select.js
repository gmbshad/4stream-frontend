import React from 'react';
import classNames from 'classnames';

import ActionIcon from './ActionIcon';
import {ACTION_TYPE} from './ActionIcon';

export default class Select extends React.Component {

  renderOptions(options) {
    return options.map(option =>
        <option className="b-select-option" key={option.value} value={option.value}>{option.label}</option>);
  }

  adjustIndex(adjustment) {
    const {value, options} = this.props;
    const optionsLength = options.length;
    const currentIndex = options.findIndex((option) => option.value === value);
    const nextIndex = (currentIndex + adjustment + optionsLength) % optionsLength;
    const nextValue = options[nextIndex].value;
    this.props.onChange({
      target: {
        value: nextValue
      }
    });
  }

  render() {
    const {value, options, optionGroups, onChange, smallFont, withNavigation} = this.props;
    const selectClasses = classNames({
      'b-select': true,
      'b-select--small': smallFont
    });
    const inputClasses = classNames({
      'b-select-input': true,
      'b-select-input--small': smallFont
    });
    const renderedOptions = (optionGroups === undefined)
        ? this.renderOptions(options)
        : optionGroups.map(optionGroup => (
            <optGroup key={optionGroup.label} className="b-select-option-group" label={optionGroup.label}>
              {this.renderOptions(optionGroup.options)}
            </optGroup>
    ));
    const navigateLeft = !withNavigation ? null : (
      <div className="b-select__navigation">
        <div className="b-select-navigation">
          <ActionIcon type={ACTION_TYPE.STEP_BACKWARD} onAction={this.adjustIndex.bind(this, -1)}/>
        </div>
      </div>
    );
    const navigateRight = !withNavigation ? null : (
      <div className="b-select__navigation">
        <div className="b-select-navigation">
          <ActionIcon type={ACTION_TYPE.STEP_FORWARD} onAction={this.adjustIndex.bind(this, 1)}/>
        </div>
      </div>
    );
    return (
        <div className={selectClasses}>
          <div className="b-select__input">
            <select className={inputClasses} value={value} onChange={onChange}>
              {renderedOptions}
            </select>
          </div>
          <div className="b-select__arrow">
            <div className="b-select-arrow fa fa-caret-down"></div>
          </div>
          {navigateLeft}
          {navigateRight}
        </div>
    );
  }
}

const OPTIONS_PROP_TYPE = React.PropTypes.arrayOf(React.PropTypes.shape({
  value: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired
}));

Select.propTypes = {
  value: React.PropTypes.string.isRequired,
  options: OPTIONS_PROP_TYPE,
  optionGroups: React.PropTypes.arrayOf(React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    options: OPTIONS_PROP_TYPE
  })),
  onChange: React.PropTypes.func.isRequired,
  smallFont: React.PropTypes.bool,
  withNavigation: React.PropTypes.bool
};


