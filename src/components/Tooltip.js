import React from 'react';
import ReactTooltip from 'react-tooltip';

export default class Tooltip extends React.Component {
  render() {
    const {id, text} = this.props;
    return (
        <div className="b-tooltip fa fa-lg fa-question-circle"
           data-tip={text}
           data-for={id}
           data-place="top"
           data-event="click"
           data-border="true"
           >
          <ReactTooltip class="b-tooltip-text" id={id} type="light" effect="solid" html/>
        </div>
    );
  }
}

Tooltip.propTypes = {
  id: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired
};
