import React from 'react';
import classNames from 'classnames';
import {sprintf} from 'sprintf-js';

import {localizeString} from '../localization/LocalizationUtils';

export default class TextArea extends React.Component {

  renderCaptionDiv(captionClassNames, text) {
    return (
        <div className="b-textarea-caption-wrapper">
          <div className="b-textarea__caption">
            <div className={captionClassNames}>
              {text}
            </div>
          </div>
        </div>
    );
  }
  
  getCaptionClassNames(smallFont) {
    return classNames({
      'b-textarea-caption': true,
      'b-textarea-caption--small': smallFont
    });
  }

  renderCaption() {
    const {countChars, smallFont, value, maxLength, remark} = this.props;
    if (!countChars && !remark) {
      return null;
    }
    let caption = '';
    const captionClassNames = this.getCaptionClassNames(smallFont);
    if (countChars) {
      const charactersUsed = !value ? 0 : value.length;
      caption += sprintf(localizeString('TEXTAREA.USED_CHARS'), charactersUsed, maxLength);
      if (remark) {
        caption += '. ';
      }
    }
    if (remark) {
      caption += remark;
    }
    return this.renderCaptionDiv(captionClassNames, caption);
  }

  render() {
    const {value, placeholder, rowNumber, maxLength, onChange, fillParent, smallFont} = this.props;
    const textareaClasses = classNames({
      'b-textarea': true,
      'b-textarea--fill-parent': fillParent,
      'b-textarea--small': smallFont
    });
    return (
        <div className="b-textarea-container">
          <textarea className={textareaClasses} value={value} placeholder={placeholder} rows={rowNumber}
                    maxLength={maxLength} onChange={onChange} />
          {this.renderCaption()}
        </div>
    );
  }
}

TextArea.propTypes = {
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  maxLength: React.PropTypes.number.isRequired,
  placeholder: React.PropTypes.string,
  rowNumber: React.PropTypes.number,
  fillParent: React.PropTypes.bool,
  smallFont: React.PropTypes.bool,
  countChars: React.PropTypes.bool,
  remark: React.PropTypes.string
};
