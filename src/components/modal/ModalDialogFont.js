import React from 'react';
import classNames from 'classnames';

import ModalDialog from './ModalDialog';
import Select from '../../components/Select';
import InputRange from '../../components/InputRange';
import ColorPicker from '../../components/ColorPicker';
import AnimationSelect from '../../components/AnimationSelect';
import StyledText from '../../components/StyledText';
import {ANIMATION_TYPE} from '../../components/AnimationSelect';
import {localizeString} from '../../localization/LocalizationUtils';
import {FONT_SETTINGS_TYPE} from '../../utils/Types';

const SAMPLE_TEXT = localizeString('FONT_DIALOG.SAMPLE_TEXT');

const CYRILLIC_GOOGLE_FONTS = [
  'Anonymous Pro',
  'Arimo',
  'Bad Script',
  'Comfortaa',
  'Cormorant',
  'Cormorant Infant',
  'Cormorant SC',
  'Cormorant Unicase',
  'Cousine',
  'Cuprum',
  'Didact Gothic',
  'EB Garamond',
  'El Messiri',
  'Fira Mono',
  'Fira Sans',
  'Forum',
  'Istok Web',
  'Jura',
  'Kelly Slab',
  'Kurale',
  'Lobster',
  'Lora',
  'Marck Script',
  'Marmelad',
  'Merriweather',
  'Neucha',
  'Noto Sans',
  'Noto Serif',
  'Open Sans',
  'Oranienbaum',
  'PT Mono',
  'PT Sans',
  'PT Sans Caption',
  'PT Sans Narrow',
  'PT Serif',
  'PT Serif Caption',
  'Pattaya',
  'Philosopher',
  'Play',
  'Playfair Display',
  'Playfair Display SC',
  'Poiret One',
  'Prosto One',
  'Roboto',
  'Roboto Condensed',
  'Roboto Mono',
  'Roboto Slab',
  'Rubik',
  'Rubik Mono One',
  'Rubik One',
  'Russo One',
  'Scada',
  'Tenor Sans',
  'Tinos',
  'Ubuntu',
  'Ubuntu Condensed',
  'Ubuntu Mono',
  'Underdog',
  'Yeseva One',
];

export default class ModalDialogFont extends ModalDialog {

  constructor(props) {
    super(props);

    this.updateFont = this.updateFont.bind(this);
    this.updateFontSize = this.updateFontSize.bind(this);
    this.updateFontColor = this.updateFontColor.bind(this);
    this.updateShadowSize = this.updateShadowSize.bind(this);
    this.updateShadowColor = this.updateShadowColor.bind(this);
    this.updateAnimation = this.updateAnimation.bind(this);
    this.updateBackgroundColor = this.updateBackgroundColor.bind(this);
    this.updateBackgroundOpacity = this.updateBackgroundOpacity.bind(this);
  }

  componentWillMount() {
    const {fontSettings} = this.props;
    this.setState(fontSettings);
  }

  getControls() {
    return [
      {
        key: 'confirm',
        label: localizeString('MODAL_DIALOG.CONTROLS.SAVE'),
        action: () => {
          this.props.onSave(this.state);
        }
      },
      {
        key: 'cancel',
        label: localizeString('MODAL_DIALOG.CONTROLS.CANCEL'),
        action: () => {}
      }
    ];
  }

  updateFont(event) {
    const value = event.target.value;
    this.setState({
      fontFamily: value
    });
  }

  updateFontSize(value) {
    this.setState({
      fontSize: value
    });
  }

  updateFontColor(value) {
    this.setState({
      fontColor: value
    });
  }

  updateShadowSize(value) {
    this.setState({
      shadowSize: value
    });
  }

  updateShadowColor(value) {
    this.setState({
      shadowColor: value
    });
  }

  updateAnimation(value) {
    this.setState({
      animation: value
    });
  }

  updateBackgroundColor(value) {
    this.setState({
      backgroundColor: value
    });
  }

  updateBackgroundOpacity(value) {
    this.setState({
      backgroundOpacity: value
    });
  }

  renderSetting(label, element, increasedMargin) {
    const settingClasses = classNames({
      'b-modal-dialog-font__setting': true,
      'b-modal-dialog-font__setting--increased-margin': increasedMargin
    });
    return (
        <div className={settingClasses}>
          <div className="b-modal-dialog-font-setting">
            <div className="b-modal-dialog-font-setting__label">
              <div className="b-modal-dialog-font-setting-label">
                {label}:
              </div>
            </div>
            <div className="b-modal-dialog-font-settings__element">
              <div className="b-modal-dialog-font-settings-element">
                {element}
              </div>
            </div>
          </div>
        </div>
    );
  }

  renderPreview() {
    return (
        <div className="b-modal-dialog-font__preview">
          <div className="b-modal-dialog-font-preview">
            <StyledText text={SAMPLE_TEXT} fontSettings={this.state}/>
          </div>
        </div>
    );
  }

  renderContent() {
    const fontOptions = CYRILLIC_GOOGLE_FONTS.map((font) => {
      return {
        label: font,
        value: font
      };
    });
    const fontFamilySelect = (
        <Select value={this.state.fontFamily} onChange={this.updateFont} options={fontOptions} withNavigation/>
    );
    const fontFamilyLabel = localizeString('FONT_DIALOG.FONT_FAMILY_LABEL');
    const fontFamilySetting = this.renderSetting(fontFamilyLabel, fontFamilySelect);

    const fontSizeLabel = localizeString('FONT_DIALOG.FONT_SIZE_LABEL');
    const fontSizeElement = (
        <InputRange value={this.state.fontSize} min={12} max={50} onChange={this.updateFontSize} units="px"/>
    );
    const fontSizeSetting = this.renderSetting(fontSizeLabel, fontSizeElement);

    const fontColorLabel = localizeString('FONT_DIALOG.FONT_COLOR_LABEL');
    const fontColorElement = <ColorPicker value={this.state.fontColor} onChange={this.updateFontColor} displayBottom/>;
    const fontColorSetting = this.renderSetting(fontColorLabel, fontColorElement, true);

    const shadowSizeLabel = localizeString('FONT_DIALOG.SHADOW_SIZE_LABEL');
    const shadowSizeElement = (
        <InputRange value={this.state.shadowSize} min={0} max={50} onChange={this.updateShadowSize} units="px"/>
    );
    const shadowSizeSetting = this.renderSetting(shadowSizeLabel, shadowSizeElement);

    const shadowColorLabel = localizeString('FONT_DIALOG.SHADOW_COLOR_LABEL');
    const shadowColorElement = (
        <ColorPicker value={this.state.shadowColor} onChange={this.updateShadowColor} displayBottom/>
    );
    const shadowColorSetting = this.renderSetting(shadowColorLabel, shadowColorElement, true);

    const animationLabel = localizeString('FONT_DIALOG.ANIMATION_LABEL');
    const animationElement = (
        <AnimationSelect value={this.state.animation} onChange={this.updateAnimation} type={ANIMATION_TYPE.PERSISTENT}
                         noPreview/>
    );
    const animationSetting = this.renderSetting(animationLabel, animationElement, true);

    const backgroundColorLabel = localizeString('FONT_DIALOG.BACKGROUND_COLOR_LABEL');
    const backgroundColorElement = (
        <ColorPicker value={this.state.backgroundColor} onChange={this.updateBackgroundColor}/>
    );
    const backgroundColorSetting = this.renderSetting(backgroundColorLabel, backgroundColorElement);

    const backgroundOpacity = localizeString('FONT_DIALOG.BACKGROUND_OPACITY_LABEL');
    const backgroundOpacityElement = (
        <InputRange value={this.state.backgroundOpacity} onChange={this.updateBackgroundOpacity} min={0} max={100}
                    units="%"/>
    );
    const backgroundOpacitySetting = this.renderSetting(backgroundOpacity, backgroundOpacityElement);

    return (
        <div className="b-modal-dialog-font">
          {this.renderPreview()}
          {fontFamilySetting}
          {fontSizeSetting}
          {fontColorSetting}
          {shadowSizeSetting}
          {shadowColorSetting}
          {animationSetting}
          {backgroundOpacitySetting}
          {backgroundColorSetting}
        </div>
    );
  }
}

ModalDialogFont.propTypes = Object.assign({}, ModalDialog.propTypes, {
  fontSettings: FONT_SETTINGS_TYPE,
  onSave: React.PropTypes.func.isRequired
});
