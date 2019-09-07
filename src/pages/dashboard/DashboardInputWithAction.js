import React from 'react';

import Input from '../../components/Input';
import {getMockValidation} from '../../utils/Validations';
import {localizeString} from '../../localization/LocalizationUtils';
import {copyToClipboard} from '../../utils/ClipboardUtils';

export default class DashboardInputWithAction extends React.Component {

  constructor(props) {
    super(props);
    this.copyUrlToClipboard = this.copyUrlToClipboard.bind(this);
  }

  copyUrlToClipboard() {
    const value = this.refs.value.getRef();
    value.focus();
    value.setSelectionRange(0, value.value.length);
    copyToClipboard();
  }

  renderLink(label, faClass, action) {
    return (
        <div className="b-dashboard-link" onClick={action}>
          <div className={`b-dashboard-link__icon fa ${faClass}`}></div>
          <div className="b-dashboard-link__anchor">
            {label}
          </div>
        </div>
    );
  }

  render() {
    const {action} = this.props;
    const actionElement = !action
        ? this.renderLink(localizeString('DASHBOARD_LINK_INPUT.COPY_LINK'), 'fa-clipboard', this.copyUrlToClipboard)
        : this.renderLink(action.label, action.faClass, action.action);
    return (
        <div className="b-dashboard-input-with-action">
          <div className="b-dashboard-input-with-action__input">
            <Input ref="value" value={this.props.value} validation={getMockValidation()} smallFont wide/>
          </div>
          <div className="b-dashboard-input-with-action__link">
            {actionElement}
          </div>
        </div>
    );
  }
}

DashboardInputWithAction.propTypes = {
  value: React.PropTypes.string.isRequired,
  action: React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    faClass: React.PropTypes.string.isRequired,
    action: React.PropTypes.func.isRequired
  })
};

