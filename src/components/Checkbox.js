import React from 'react';
import classNames from 'classnames';

export default class Checkbox extends React.Component {

  constructor(props) {
    super(props);
    this.updateChecked = this.updateChecked.bind(this);
  }

  updateChecked(event) {
    const newValue = event.target.checked;
    this.props.onChange(newValue);
  }

  render() {
    const {id, label, checked} = this.props;
    const checkboxCheckClassNames = classNames({
      'b-checkbox-box-check fa fa-check': true,
      'b-checkbox-box-check--hidden': !checked
    });
    return (
        <div className="b-checkbox">
          <input className="b-checkbox__input" id={id} type="checkbox" checked={checked} onChange={this.updateChecked}/>
          <label className="b-checkbox-label" htmlFor={id}>
            <div className="b-checkbox-label__box">
            <span className="b-checkbox-box">
              <div className="b-checkbox-box__check">
                <div className={checkboxCheckClassNames}/>
              </div>
            </span>
            </div>
            {label}
          </label>
        </div>
    );
  }
}

Checkbox.propTypes = {
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  checked: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired
};
