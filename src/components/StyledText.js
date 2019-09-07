import React from 'react';
import classNames from 'classnames';
import WebFonts from 'webfontloader';

import {hex2rgb} from '../utils/ColorUtils';
import {FONT_SETTINGS_TYPE} from '../utils/Types';
import Constants from '../utils/Constants';

export default class StyledText extends React.Component {

  componentWillMount() {
    this.setState({
      loadingFont: true
    });
    this.loadFont(this.props.fontSettings.fontFamily);
  }

  componentWillReceiveProps(nextProps) {
    const newFontFamily = nextProps.fontSettings.fontFamily;
    const oldFontFamily = this.props.fontSettings.fontFamily;
    if (newFontFamily !== oldFontFamily) {
      this.loadFont(nextProps.fontSettings.fontFamily);
    }
  }

  loadFont(fontFamily) {
    this.setState({
      loadingFont: true
    });
    WebFonts.load({
      google: {
        families: [`${fontFamily}&subset=cyrillic`]
      },
      fontloading: () => {
        this.setState({
          loadingFont: false
        });
      }
    });
  }

  calculateBackgroundColor() {
    const {backgroundColor, backgroundOpacity} = this.props.fontSettings;
    const rgb = hex2rgb(backgroundColor);
    const alpha = (backgroundOpacity / 100);
    return rgb.replace('rgb', 'rgba').replace(')', `,${alpha})`);
  }

  renderChar(char, charIndex, wordIndex, chars) {
    const {replaceTwitchChar} = this.props;
    const {animation} = this.props.fontSettings;
    const textAnimated = animation !== null;

    const isTwitchChar = (replaceTwitchChar && char === Constants.DONATION_SENDER_TWITCH_PLACEHOLDER);
    const charClasses = classNames({
      'b-styled-text-word__char': true,
      'animated infinite': textAnimated,
      [animation]: textAnimated,
      'fa fa-twitch': isTwitchChar
    });
    const animationDelay = `${Math.floor(charIndex / 10)}.${charIndex % 10}s`;
    const charStyle = {
      animationDelay: animationDelay,
      WebkitAnimationDelay: animationDelay
    };
    const renderedChar = (!isTwitchChar) ? char : '';
    chars.push(
        <div className={charClasses} key={`char_${wordIndex}_${charIndex}`} style={charStyle}>{renderedChar}</div>
    );
  }

  render() {
    const {text} = this.props;
    const {fontFamily, fontSize, fontColor, shadowSize, shadowColor} = this.props.fontSettings;

    const words = [];
    if (!this.state.loadingFont) {
      text.split(' ').forEach((word, wordIndex) => {
        const chars = [];
        word.split('').forEach((char, charIndex) => {
          this.renderChar(char, charIndex, wordIndex, chars);
        });
        words.push(
            <div className="b-styled-text-words__word" key={`word_${wordIndex}`}>
              <div className="b-styled-text-word">
                {chars}
              </div>
            </div>
        );
      });
    }
    const fontStyle = {
      fontFamily: fontFamily,
      fontSize: fontSize + 'px',
      color: fontColor,
      textShadow: `0 0 ${shadowSize}px ${shadowColor}`
    };

    const charsClasses = classNames({
      'b-styled-text-words': true,
      'fa fa-spinner fa-pulse': this.state.loadingFont,
    });
    const charsStyle = {
      backgroundColor: this.calculateBackgroundColor()
    };

    return (
      <div className="b-styled-text" style={fontStyle}>
        <div className={charsClasses} style={charsStyle}>
          {words}
        </div>
      </div>
    );
  }
}

StyledText.propTypes = {
  text: React.PropTypes.string,
  fontSettings: FONT_SETTINGS_TYPE.isRequired,
  replaceTwitchChar: React.PropTypes.bool
};

