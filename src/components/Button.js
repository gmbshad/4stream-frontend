import React from 'react';
import classNames from 'classnames';

export default class Button extends React.Component {

  render() {
    const {disabled, wide, wider, onClick, text, fillParent, fontAwesomeClass, increasedPadding} = this.props;
    const classes = classNames({
      'b-button': true,
      'b-button--disabled': disabled,
      'b-button--fill-parent': fillParent,
      'b-button--wide': wide,
      'b-button--wider': wider,
      'b-button--increased-padding': increasedPadding
    });
    let iconClass = 'b-button__icon';
    if (fontAwesomeClass !== undefined) {
      iconClass += ` fa ${fontAwesomeClass}`;
    }
    const label = (text !== '') ? (
      <div className="b-button-label">
        {text}
      </div>
    ) : null;
    return (
        <button className={classes} type="button" disabled={disabled} onClick={onClick}>
          <div className={iconClass}>
            {label}
          </div>
        </button>
    );
  }
}

Button.propTypes = {
  text: React.PropTypes.string.isRequired,
  disabled: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  fillParent: React.PropTypes.bool,
  fontAwesomeClass: React.PropTypes.string,
  wide: React.PropTypes.bool,
  wider: React.PropTypes.bool,
  increasedPadding: React.PropTypes.bool
};
