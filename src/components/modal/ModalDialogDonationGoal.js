import React from 'react';
import classNames from 'classnames';

import ModalDialog from './ModalDialog';
import Input from '../../components/Input';
import DayPicker from '../../components/DayPicker';
import {localizeString} from '../../localization/LocalizationUtils';
import Constants from '../../utils/Constants';
import {getMockValidation, getIntegerBoundsValidation} from '../../utils/Validations';
import Validator from '../../utils/Validator';
import {DONATION_GOAL_TYPE} from '../../utils/Types';

export default class ModalDialogDonationGoal extends ModalDialog {

  constructor(props) {
    super(props);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateGoalAmount = this.updateGoalAmount.bind(this);
    this.updateCurrentAmount = this.updateCurrentAmount.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.setFormValid = this.setFormValid.bind(this);
  }

  componentWillMount() {
    this.setState({
      title: null,
      goalAmount: null,
      currentAmount: null,
      endDate: null
    });
    const {donationGoal} = this.props;
    if (donationGoal !== undefined) {
      this.setState(donationGoal);
    }
  }

  componentDidMount() {
    this.validator = new Validator(this.setFormValid, [this.refs.title, this.refs.goalAmount, this.refs.currentAmount]);
    this.validator.validate();
  }

  getParentClassNames() {
    return classNames('b-modal-dialog--donation-goal', super.getParentClassNames());
  }

  getContentClassNames() {
    return classNames('b-modal-dialog__content--donation-goal', super.getContentClassNames());
  }

  getControls() {
    const donationGoalObject = {
      title: this.state.title,
      goalAmount: this.state.goalAmount,
      currentAmount: this.state.currentAmount,
      endDate: this.state.endDate
    };
    const actionArgument = (this.state.id === undefined)
        ? donationGoalObject : {donationGoalId: this.state.id, donationGoal: donationGoalObject};
    return [
      {
        key: 'confirm',
        label: localizeString('MODAL_DIALOG.CONTROLS.CONFIRM'),
        disabledCondition: () => !this.state.formValid,
        action: () => {
          this.props.action(actionArgument);
        }
      }
    ];
  }

  setFormValid(formValid) {
    this.setState({formValid});
  }

  updateTitle(title) {
    this.setState({title}, this.validator.validate);
  }

  updateGoalAmount(goalAmount) {
    this.setState({goalAmount}, this.validator.validate);
  }

  updateCurrentAmount(currentAmount) {
    this.setState({currentAmount}, this.validator.validate);
  }

  updateEndDate(endDate) {
    this.setState({endDate});
  }

  renderContent() {
    return (
        <div className="b-modal-dialog-donation-goal">
          <div className="b-modal-dialog-donation-goal__input">
            <Input ref="title" value={this.state.title} placeholder={localizeString('DONATION_GOAL_DIALOG.TITLE_PLACEHOLDER')}
                   onChange={this.updateTitle} required maxLength={Constants.DONATION_GOAL_MAX_TITLE_LENGTH}
                   fillParent lazyValidation validation={getMockValidation()}/>
          </div>
          <div className="b-modal-dialog-donation-goal__input">
            <Input ref="goalAmount" value={this.state.goalAmount} placeholder={localizeString('DONATION_GOAL_DIALOG.GOAL_AMOUNT_PLACEHOLDER')}
                   onChange={this.updateGoalAmount} required maxLength={6}
                   fillParent lazyValidation validation={getIntegerBoundsValidation(Constants.DONATION_GOAL_MIN_AMOUNT,
                    Constants.DONATION_GOAL_MAX_AMOUNT)}/>
          </div>
          <div className="b-modal-dialog-donation-goal__input">
            <Input ref="currentAmount" value={this.state.currentAmount} placeholder={localizeString('DONATION_GOAL_DIALOG.CURRENT_AMOUNT_PLACEHOLDER')}
                   onChange={this.updateCurrentAmount} required maxLength={6} fillParent lazyValidation
                   validation={getIntegerBoundsValidation(0, Constants.DONATION_GOAL_MAX_AMOUNT)}/>
          </div>
          <div className="b-modal-dialog-donation-goal__input">
            <DayPicker value={this.state.endDate} onChange={this.updateEndDate}
                       placeHolder={localizeString('DONATION_GOAL_DIALOG.END_DATE_PLACEHOLDER')}/>
          </div>
        </div>
    );
  }
}

ModalDialogDonationGoal.propTypes = Object.assign({}, ModalDialog.propTypes, {
  action: React.PropTypes.func.isRequired,
  donationGoal: DONATION_GOAL_TYPE
});

