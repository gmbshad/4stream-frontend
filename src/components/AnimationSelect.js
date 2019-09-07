import React from 'react';
import classNames from 'classnames';

import Select from './Select';
import ActionIcon from './ActionIcon';
import {ACTION_TYPE} from './ActionIcon';
import {localizeString} from '../localization/LocalizationUtils';

const OPTIONS = [
  'bounce',
  'flash',
  'pulse',
  'rubberBand',
  'shake',
  'headShake',
  'swing',
  'tada',
  'wobble',
  'jello',
  'bounceIn',
  'bounceInDown',
  'bounceInLeft',
  'bounceInRight',
  'bounceInUp',
  'bounceOut',
  'bounceOutDown',
  'bounceOutLeft',
  'bounceOutRight',
  'bounceOutUp',
  'fadeIn',
  'fadeInDown',
  'fadeInDownBig',
  'fadeInLeft',
  'fadeInLeftBig',
  'fadeInRight',
  'fadeInRightBig',
  'fadeInUp',
  'fadeInUpBig',
  'fadeOut',
  'fadeOutDown',
  'fadeOutDownBig',
  'fadeOutLeft',
  'fadeOutLeftBig',
  'fadeOutRight',
  'fadeOutRightBig',
  'fadeOutUp',
  'fadeOutUpBig',
  'flipInX',
  'flipInY',
  'flipOutX',
  'flipOutY',
  'lightSpeedIn',
  'lightSpeedOut',
  'rotateIn',
  'rotateInDownLeft',
  'rotateInDownRight',
  'rotateInUpLeft',
  'rotateInUpRight',
  'rotateOut',
  'rotateOutDownLeft',
  'rotateOutDownRight',
  'rotateOutUpLeft',
  'rotateOutUpRight',
  'hinge',
  'rollIn',
  'rollOut',
  'zoomIn',
  'zoomInDown',
  'zoomInLeft',
  'zoomInRight',
  'zoomInUp',
  'zoomOut',
  'zoomOutDown',
  'zoomOutLeft',
  'zoomOutRight',
  'zoomOutUp',
  'slideInDown',
  'slideInLeft',
  'slideInRight',
  'slideInUp',
  'slideOutDown',
  'slideOutLeft',
  'slideOutRight',
  'slideOutUp'
];

const NO_ANIMATION_VALUE = 'none';

const ANIMATION_TYPE = {
  IN: 'in',
  OUT: 'out',
  PERSISTENT: 'persistent'
};

export default class AnimationSelect extends React.Component {

  constructor(props) {
    super(props);

    this.updateValue = this.updateValue.bind(this);
    this.rerunAnimation = this.rerunAnimation.bind(this);
  }

  componentWillMount() {
    this.rerunAnimation();
  }

  updateValue(event) {
    this.updateValueInternal(event.target.value);
  }

  updateValueInternal(nextValue) {
    const nextValueExternal = (nextValue !== NO_ANIMATION_VALUE) ? nextValue : null;
    this.props.onChange(nextValueExternal);
  }

  getOptions() {
    const options = [{
      value: NO_ANIMATION_VALUE,
      label: localizeString('NO_ANIMATION')
    }];
    let filterFunction = () => true;
    const {type} = this.props;
    const filterInFunction = (animation) => {
      return !animation.includes('Out') && animation !== 'hinge';
    };
    if (type === ANIMATION_TYPE.IN) {
      filterFunction = (animation) => {
        return filterInFunction(animation);
      };
    } else if (type === ANIMATION_TYPE.OUT) {
      filterFunction = (animation) => {
        return !filterInFunction(animation);
      };
    } else if (type === ANIMATION_TYPE.PERSISTENT) {
      filterFunction = (animation) =>
        ['bounce', 'pulse', 'rubberBand', 'headShake', 'swing', 'tada', 'wobble', 'jello'].includes(animation);
    }
    OPTIONS.forEach(option => {
      if (filterFunction(option)) {
        options.push({
          value: option,
          label: option
        });
      }
    });
    return options;
  }

  rerunAnimation() {
    this.setState({
      animationId: Math.random()
    });
  }

  render() {
    const {value, smallFont, noPreview} = this.props;
    const options = this.getOptions();
    const adjustedValue = value || NO_ANIMATION_VALUE;
    const animationClasses = classNames({
      'b-animation-select-preview-box': true,
      'animated': adjustedValue !== NO_ANIMATION_VALUE,
      [value]: adjustedValue !== NO_ANIMATION_VALUE
    });
    const playAnimation = noPreview ? null : (
        <div className="b-animation-select-controls__item">
          <ActionIcon type={ACTION_TYPE.PLAY} onAction={this.rerunAnimation}/>
        </div>
    );
    const animationPreview = noPreview ? null : (
        <div className="b-animation-select__preview">
          <div className="b-animation-select-preview" key={this.state.animationId}>
            <div className={animationClasses}>
              <div className="b-animation-select-preview-box__image"/>
              <div className="b-animation-select-preview-box__text"/>
            </div>
          </div>
        </div>
    );
    return (
        <div className="b-animation-select">
          <div className="b-animation-select__select">
            <Select ref="select" value={adjustedValue} onChange={this.updateValue} smallFont={smallFont} options={options}
                    withNavigation/>
          </div>
          <div className="b-animation-select__controls">
            <div className="b-animation-select-controls">
              {playAnimation}
            </div>
          </div>
          {animationPreview}
        </div>
    );
  }
}

AnimationSelect.propTypes = {
  type: React.PropTypes.oneOf(Object.keys(ANIMATION_TYPE).map(key => ANIMATION_TYPE[key])).isRequired,
  value: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  smallFont: React.PropTypes.bool,
  noPreview: React.PropTypes.bool
};

export {ANIMATION_TYPE};

