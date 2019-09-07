import React from 'react';

const ACTION_TYPE = {
  DELETE: 'delete',
  PLAY: 'play',
  STOP: 'stop',
  INFO: 'info',
  EDIT: 'edit',
  STEP_BACKWARD: 'stepBack',
  STEP_FORWARD: 'stepForward'
};

export default class ActionIcon extends React.Component {
  render() {
    let classNames = 'b-action-item ';
    if (this.props.white) {
      classNames = classNames.concat('b-action-item--white ');
    }
    if (this.props.type === ACTION_TYPE.DELETE) {
      classNames = classNames.concat('fa fa-lg fa-trash');
    } else if (this.props.type === ACTION_TYPE.PLAY) {
      classNames = classNames.concat('fa fa-lg fa-play-circle');
    } else if (this.props.type === ACTION_TYPE.STOP) {
      classNames = classNames.concat('fa fa-lg fa-stop-circle');
    } else if (this.props.type === ACTION_TYPE.INFO) {
      classNames = classNames.concat('fa fa-lg fa-info-circle');
    } else if (this.props.type === ACTION_TYPE.EDIT) {
      classNames = classNames.concat('fa fa-lg fa-pencil');
    } else if (this.props.type === ACTION_TYPE.STEP_BACKWARD) {
      classNames = classNames.concat('fa fa-lg fa-step-backward');
    } else if (this.props.type === ACTION_TYPE.STEP_FORWARD) {
      classNames = classNames.concat('fa fa-lg fa-step-forward');
    }
    return (
      <div className={classNames} onClick={this.props.onAction}>
      </div>
    );
  }
}
export {ACTION_TYPE};

ActionIcon.propTypes = {
  type: React.PropTypes.oneOf(Object.keys(ACTION_TYPE).map(key => ACTION_TYPE[key])).isRequired,
  onAction: React.PropTypes.func.isRequired,
  white: React.PropTypes.bool
};

