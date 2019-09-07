// React color picker 2
// from https://codepen.io/amwill/pen/vLmdvK

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Input from '../components/Input';
import {hex2rgb, rgb2hex} from '../utils/ColorUtils';
import {getColorValidation} from '../utils/Validations';
import {clamp} from '../utils/MathUtils';

const wGradient = 180;
const hGradient = 180;
const wStripe = 40;
const hStripe = hGradient;
const offsetCS = 10;
const padding = 15;
const fullWidth = wGradient + wStripe + 2 * padding + offsetCS;
const fullHeight = hGradient + 2 * padding;

const gradientX = padding;
const gradientY = padding;
const stripeX = padding + wGradient + offsetCS;
const stripeY = padding;

const ColorPicker = React.createClass({
  propTypes: {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    displayBottom: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
      isPickerVisible: false
    };
  },
  componentWillMount: function() {
    document.addEventListener('click', this.handleClick, false);
  },
  componentWillUnmount: function() {
    document.removeEventListener('click', this.handleClick, false);
  },
  handleClick: function(event) {
    if (!ReactDOM.findDOMNode(this).contains(event.target)) {
      this.setState({isPickerVisible: false});
    }
  },
  togglePicker: function() {
    const isVisible = !this.state.isPickerVisible;
    this.setState({
      isPickerVisible: isVisible
    });
    if (isVisible) {
      this.refs.colorPickerInternal.updateGradientColor(this.props.value);
    }
  },
  isValid: function() {
    return this.refs.colorTextInput.isValid();
  },
  render: function() {
    return (
        <div className="b-color-picker-container">
          <div className="b-color-picker-value">
            <ColorLabel isChecked={this.state.isPickerVisible}
                        color={this.props.value}
                        handleClick={this.togglePicker}/>
            <div className="b-color-picker-value__label">
              <Input ref="colorTextInput" className="b-color-picker-text-input"
                     value={this.props.value} onChange={this.props.onChange} maxLength={7}
                     smallFont narrow required validation={getColorValidation()}/>
            </div>
          </div>
          <ColorPickerInternal ref="colorPickerInternal"
                               isVisible={this.state.isPickerVisible}
                               color={this.props.value}
                               onChange={this.props.onChange}
                               displayBottom={this.props.displayBottom}/>
        </div>
    );
  }
});

const ColorLabel = React.createClass({
  propTypes: {
    handleClick: React.PropTypes.func.isRequired,
    color: React.PropTypes.string.isRequired
  },
  render: function() {
    const styles = {
      backgroundColor: hex2rgb(this.props.color)
    };
    return (
        <div>
          <button className="b-color-picker-label" type="button" style={styles} onClick={this.props.handleClick}/>
        </div>
    );
  }
});

const DRAG_MODE = {
  NONE: 'NONE',
  GRADIENT: 'GRADIENT',
  STRIP: 'STRIP'
};

const ColorPickerInternal = React.createClass({
  propTypes: {
    color: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    isVisible: React.PropTypes.bool.isRequired,
    displayBottom: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
      gradientColor: this.props.color
    };
  },
  componentDidMount: function() {
    const canvas = this.refs.canvas;
    this.ctx = canvas.getContext('2d');
  },
  updateGradientColor(color) {
    this.setState({
      gradientColor: color
    }, this.updateColors);
  },
  updateColors() {
    this.gradientBlock();
    this.stripFill();
  },
  stripFill: function() {
    this.ctx.rect(stripeX, stripeY, wStripe, hStripe);
    const grd1 = this.ctx.createLinearGradient(0, 0, 0, hStripe);
    grd1.addColorStop(0, 'rgb(255, 0, 0)'); // red
    grd1.addColorStop(0.17, 'rgb(255, 255, 0)'); // yellow
    grd1.addColorStop(0.34, 'rgb(0, 255, 0)'); // green
    grd1.addColorStop(0.51, 'rgb(0, 255, 255)'); // aqua
    grd1.addColorStop(0.68, 'rgb(0, 0, 255)'); // blue
    grd1.addColorStop(0.85, 'rgb(255, 0, 255)'); // magenta
    grd1.addColorStop(1, 'rgb(255, 0, 0)'); // red
    this.ctx.fillStyle = grd1;
    this.ctx.fill();
  },
  gradientBlock: function() {
    this.ctx.fillStyle = hex2rgb(this.state.gradientColor);
    this.ctx.fillRect(gradientX, gradientY, wGradient, hGradient);
    const grdWhite = this.ctx.createLinearGradient(gradientX, gradientY, wGradient, 0);
    grdWhite.addColorStop(0, 'rgb(255,255,255)');
    grdWhite.addColorStop(1, 'transparent');
    this.ctx.fillStyle = grdWhite;
    this.ctx.fillRect(gradientX, gradientY, wGradient, hGradient);
    const grdBlack = this.ctx.createLinearGradient(gradientX, gradientY, 0, hGradient);
    grdBlack.addColorStop(0, 'transparent');
    grdBlack.addColorStop(1, 'rgb(0,0,0)');
    this.ctx.fillStyle = grdBlack;
    this.ctx.fillRect(gradientX, gradientY, wGradient, hGradient);
    // and 4 pixels explicitly in the corners
    this.ctx.fillStyle = hex2rgb('#FFFFFF');
    this.ctx.fillRect(gradientX, gradientY, 1, 1);
    this.ctx.fillStyle = hex2rgb('#000000');
    this.ctx.fillRect(gradientX, gradientY + hGradient - 1, 1, 1);
    this.ctx.fillRect(gradientX + wGradient - 1, gradientY + hGradient - 1, 1, 1);
    this.ctx.fillStyle = hex2rgb(this.state.gradientColor);
    this.ctx.fillRect(gradientX + wGradient - 1, gradientY, 1, 1);
  },
  selectColor: function(xCoordinate, yCoordinate) {
    const imageData = this.ctx.getImageData(xCoordinate, yCoordinate, 1, 1).data;
    const rgbColor = 'rgb(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ')';
    const hexColor = rgb2hex(rgbColor);
    this.props.onChange(hexColor);
    return hexColor;
  },
  clickStrip: function(xCoordinate, yCoordinate) {
    const hexColor = this.selectColor(xCoordinate, yCoordinate);
    this.updateGradientColor(hexColor);
  },
  mouseDown: function(event) {
    const xCoord = event.nativeEvent.offsetX;
    const yCoord = event.nativeEvent.offsetY;
    if (xCoord >= gradientX && xCoord < (gradientX + wGradient) &&
        yCoord >= gradientY && yCoord < (gradientY + hGradient)) {
      this.setState({dragMode: DRAG_MODE.GRADIENT});
      this.selectColor(xCoord, yCoord);
    } else if (xCoord >= stripeX && xCoord < (stripeX + wStripe) &&
        yCoord >= stripeY && yCoord < (stripeY + hStripe)) {
      this.setState({dragMode: DRAG_MODE.STRIP});
      this.clickStrip(xCoord, yCoord);
    }
  },
  mouseMove: function(event) {
    const {dragMode} = this.state;
    let xCoord = event.nativeEvent.offsetX;
    let yCoord = event.nativeEvent.offsetY;
    if (dragMode === DRAG_MODE.GRADIENT) {
      xCoord = clamp(xCoord, gradientX, gradientX + wGradient - 1);
      yCoord = clamp(yCoord, gradientY, gradientY + hGradient - 1);
      this.selectColor(xCoord, yCoord);
    } else if (dragMode === DRAG_MODE.STRIP) {
      xCoord = clamp(xCoord, stripeX, stripeX + wStripe - 1);
      yCoord = clamp(yCoord, stripeY, stripeY + hStripe - 1);
      this.clickStrip(xCoord, yCoord);
    }
  },
  stopDrag: function() {
    this.setState({dragMode: DRAG_MODE.NONE});
  },
  render() {
    const colorPickerClasses = classNames({
      'b-color-picker': true,
      'b-color-picker--hidden': !this.props.isVisible,
      'b-color-picker--bottom': this.props.displayBottom
    });
    return (
        <div className="b-color-picker-wrapper">
          <div className={colorPickerClasses}>
            <canvas className="b-color-picker-canvas"
                    height={fullHeight}
                    width={fullWidth}
                    onMouseDown={this.mouseDown}
                    onMouseMove={this.mouseMove}
                    onMouseUp={this.stopDrag}
                    onMouseOut={this.stopDrag}
                    ref="canvas">
            </canvas>
          </div>
        </div>
    );
  }
});

export default ColorPicker;
