import React from 'react';
import classNames from 'classnames';

import {INPUT_NO_VALUE} from '../utils/Constants';
import {localizeString} from '../localization/LocalizationUtils';

const NO_REQUIRED_FIELD_ERROR = localizeString('INPUT.REQUIRED_FIELD');

const CAPTION_STATE = {
  HIDDEN: 'hidden',
  INFO: 'info',
  ERROR: 'error'
};

export default class Input extends React.Component {
 
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);  
  }
  
  componentWillMount() {
    this.setState({
      changed: !this.props.lazyValidation
    });
    this.validate(this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    const {value} = nextProps;
    if (value !== this.props.value) {
      this.validate(value);
    }
  }

  getRef() {
    return this.refs.input;
  }

  isValid() {
    return this.state.valid;
  }

  adjustValue(value) {
    return (value !== undefined && value !== null) ? value : INPUT_NO_VALUE;
  }

  isValueValid(value) {
    const {required, validation} = this.props;
    const adjustedValue = this.adjustValue(value);
    return (adjustedValue === INPUT_NO_VALUE) ? !required : validation.func(adjustedValue);
  }

  onChange(event) {
    // validation error message is not displayed unless Input is markChanged
    this.setState({
      changed: true
    });
    const value = event.target.value;
    this.validate(value);
    if (this.props.onChange !== undefined) {
      this.props.onChange(value);
    }
  }
  
  validate(value, callback) {
    this.setState({valid: this.isValueValid(value)}, callback || (() => {}));
  }
  
  renderCaption() {
    const {validation, smallFont, infoMessage} = this.props;
    const value = this.adjustValue(this.props.value);
    const {valid, changed} = this.state;

    let captionState = CAPTION_STATE.HIDDEN;
    let caption = '';
    if (!valid && changed) {
      captionState = CAPTION_STATE.ERROR;
      caption = (value === INPUT_NO_VALUE) ? NO_REQUIRED_FIELD_ERROR : validation.message(value);
    } else if (infoMessage !== undefined) {
      captionState = CAPTION_STATE.INFO;
      caption = infoMessage;
    }
    const captionClassNames = classNames({
      'b-input-caption': true,
      'b-input-caption--small': smallFont,
      'b-input-caption--hidden': captionState === CAPTION_STATE.HIDDEN,
      'b-input-caption--info': captionState === CAPTION_STATE.INFO
    });
    return (
        <div className="b-input-caption-wrapper">
            <div className="b-input__caption">
              <div className={captionClassNames}>
                {caption}
              </div>
            </div>
          </div>
    );
  }
  
  render() {
    const {value, name, placeholder, maxLength, fillParent, smallFont, readOnly, narrow, cursorPointer, borderless,
        permanentBackground, wide} = this.props;
    const onClick = this.props.onClick || (() => {});
    const inputFieldClasses = classNames({
      'b-input-field': true,
      'b-input-field--fill-parent': fillParent,
      'b-input-field--small': smallFont,
      'b-input-field--narrow': narrow,
      'b-input-field--wide': wide,
      'b-input-field--cursor-pointer': cursorPointer,
      'b-input-field--borderless': borderless,
      'b-input-field--grey': readOnly && !permanentBackground
    });
    return (
      <div className="b-input">
        <div className="b-input-internal">
          <input ref="input" className={inputFieldClasses} value={this.adjustValue(value)} name={name}
                 placeholder={placeholder} onChange={this.onChange} maxLength={maxLength} autoComplete="off" 
                 readOnly={readOnly} onClick={onClick}/>
        </div>
        {this.renderCaption()}
      </div>  
    );
  }
}

Input.propTypes = {
  value: React.PropTypes.any,
  name: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  required: React.PropTypes.bool,
  readOnly: React.PropTypes.bool,
  maxLength: React.PropTypes.number,
  onChange: React.PropTypes.func,
  onClick: React.PropTypes.func,
  lazyValidation: React.PropTypes.bool,
  fillParent: React.PropTypes.bool,
  smallFont: React.PropTypes.bool,
  narrow: React.PropTypes.bool,
  wide: React.PropTypes.bool,
  cursorPointer: React.PropTypes.bool,
  borderless: React.PropTypes.bool,
  infoMessage: React.PropTypes.string,
  permanentBackground: React.PropTypes.bool,
  validation: React.PropTypes.shape({
    func: React.PropTypes.func.isRequired,
    message: React.PropTypes.func.isRequired
  }).isRequired
};
