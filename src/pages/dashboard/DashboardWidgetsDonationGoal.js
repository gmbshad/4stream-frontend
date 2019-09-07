/*eslint no-unused-vars: [2, { "varsIgnorePattern": "DonationGoalStore" }]*/
import React from 'react';
import classNames from 'classnames';
import {sprintf} from 'sprintf-js';
import AltContainer from 'alt-container';

import DonationGoalActions from '../../actions/DonationGoalActions';
import ModalDialogActions from '../../actions/ModalDialogActions';
import DonationGoalStore from '../../stores/DonationGoalStore';
import DashboardSettingsForm from './DashboardSettingsForm';
import {localizeString} from '../../localization/LocalizationUtils';
import InputRange from '../../components/InputRange';
import Constants from '../../utils/Constants';
import Tooltip from '../../components/Tooltip';
import ColorPicker from '../../components/ColorPicker';
import DonationGoal from '../../components/DonationGoal';
import Button from '../../components/Button';
import DashboardSettingsOption from './DashboardSettingsOption';
import Validator from '../../utils/Validator';
import ActionIcon from '../../components/ActionIcon';
import {ACTION_TYPE} from '../../components/ActionIcon';
import ModalDialogDonationGoal from '../../components/modal/ModalDialogDonationGoal';
import ModalDialogConfirmation from '../../components/modal/ModalDialogConfirmation';
import {DONATION_GOAL_TYPE} from '../../utils/Types';
import {getDateSeveralDaysFromNow} from '../../utils/DateUtils';
import {getDonationGoalUrl} from '../../utils/UrlUtils';
import DashboardInputWithAction from './DashboardInputWithAction';

class DashboardWidgetsDonationGoalSettings extends DashboardSettingsForm {
  constructor(props) {
    super(props);
    this.updateBarThickness = this.updateBarThickness.bind(this);
  }

  componentWillMount() {
    super.componentWillMount();

    // this is a sample end date
    this.sampleEndDate = getDateSeveralDaysFromNow(9);
  }

  componentDidMount() {
    this.validator = new Validator(this.setFormValid, [this.refs.barColor, this.refs.barBackgroundColor]);
    this.validator.validate();
  }

  getActionsToListen() {
    return [DonationGoalActions.receiveDonationGoalSettings.id, DonationGoalActions.receiveDonationGoalSettingsUpdate.id];
  }

  getStore() {
    return DonationGoalStore;
  }

  getSaveAction() {
    return DonationGoalActions.requestDonationGoalSettingsUpdate;
  }

  updateStateFromStore(donationGoalStoreState) {
    this.setState(donationGoalStoreState.donationGoalSettings);
  }

  updateBarThickness(value) {
    this.setState({
      barThickness: value
    });
  }

  updateColor(stateVar, value) {
    const stateUpdate = {};
    stateUpdate[stateVar] = value;
    this.setState(stateUpdate, this.validator.validate);
  }

  renderColorPicker(id, label, tooltip) {
    const onChange = this.updateColor.bind(this, id);
    const colorInput = (
        <ColorPicker ref={id} className="b-dashboard-settings-item" value={this.state[id]} onChange={onChange}/>
    );
    const labelElement = localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.' + label);
    const tooltipText = localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.' + tooltip);
    const tooltipElement = <Tooltip id={`${id}tooltip`} text={tooltipText}/>;
    return (
      <div className="b-dashboard-settings-form__option">
        <DashboardSettingsOption label={labelElement} value={colorInput} tooltip={tooltipElement}/>
      </div>
    );
  }

  render() {
    const donationGoalUrl = getDonationGoalUrl({token: this.props.authStore.token});
    const donationGoalLink = <DashboardInputWithAction value={donationGoalUrl}/>;
    const linkLabel = localizeString('DASHBOARD_LINK_INPUT.LINK_LABEL');

    const barThicknessInput = (
        <InputRange className="b-dashboard-settings-bar-thickness" value={this.state.barThickness}
               onChange={this.updateBarThickness} min={Constants.MIN_BAR_THICKNESS} max={Constants.MAX_BAR_THICKNESS}/>
    );
    const barThicknessLabel = localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.BAR_THICKNESS_LABEL');
    const barThicknessTooltipText = localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.BAR_THICKNESS_TOOLTIP');
    const barThicknessTooltip = (
        <Tooltip id="barThicknessTooltip" text={barThicknessTooltipText}/>
    );

    const {titleFontSettings, barTextFontSettings, remainingFontSettings, totalFontSettings} = this.state;

    const titleSettingsLabel = localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.TEXT_COLOR_LABEL');
    const titleSettings = this.renderFontSettings(localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.TEXT_COLOR_LABEL'),
        titleFontSettings, DonationGoalActions.requestDonationGoalSettingsUpdate, 'titleFontSettings');

    const barTextSettingsLabel = localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.BAR_TEXT_COLOR_LABEL');
    const barTextSettings = this.renderFontSettings(localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.BAR_TEXT_COLOR_LABEL'),
        barTextFontSettings, DonationGoalActions.requestDonationGoalSettingsUpdate, 'barTextFontSettings');

    const remainingSettingsLabel = localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.REMAINING_TEXT_LABEL');
    const remainingSettings = this.renderFontSettings(localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.REMAINING_TEXT_LABEL'),
        remainingFontSettings, DonationGoalActions.requestDonationGoalSettingsUpdate, 'remainingFontSettings');

    const totalSettingsLabel = localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.TOTAL_TEXT_LABEL');
    const totalSettings = this.renderFontSettings(localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.TOTAL_TEXT_LABEL'),
        totalFontSettings, DonationGoalActions.requestDonationGoalSettingsUpdate, 'totalFontSettings');

    return (
        <div className="b-dashboard-settings-form">
          {this.renderHeader(localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.TITLE_GENERAL'))}
          {this.renderSeparator()}
          {this.renderWarning(localizeString('DASHBOARD_WIDGETS.LINK_REMARK'))}
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={linkLabel} value={donationGoalLink} />
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={barThicknessLabel} value={barThicknessInput} tooltip={barThicknessTooltip}/>
          </div>
          {this.renderColorPicker('barColor', 'BAR_COLOR_LABEL', 'BAR_COLOR_TOOLTIP')}
          {this.renderColorPicker('barBackgroundColor', 'BAR_BACKGROUND_COLOR_LABEL', 'BAR_BACKGROUND_COLOR_TOOLTIP')}
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={titleSettingsLabel} value={titleSettings}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={barTextSettingsLabel} value={barTextSettings}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={remainingSettingsLabel} value={remainingSettings}/>
          </div>
          <div className="b-dashboard-settings-form__option">
            <DashboardSettingsOption label={totalSettingsLabel} value={totalSettings}/>
          </div>
          <div className="b-dashboard-settings-form__donation-goal">
            <div className="b-dashboard-donation-goal-container">
              <DonationGoal title={localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.EXAMPLE_TEXT')} goalAmount={900}
                            currentAmount={378} endDate={this.sampleEndDate} settings={this.state}/>
            </div>
          </div>
          {this.renderSaveButton()}
        </div>
    );
  }
}

DashboardWidgetsDonationGoalSettings.propTypes = {
  authStore: React.PropTypes.shape({
    token: React.PropTypes.string.isRequired     // NULLNU
  }).isRequired
};

class DashboardWidgetDonationGoalCard extends React.Component {

  constructor(props) {
    super(props);

    this.showDeleteGoalModal = this.showDeleteGoalModal.bind(this);
    this.showEditGoalModal = this.showEditGoalModal.bind(this);
    this.toggleActiveState = this.toggleActiveState.bind(this);
  }

  renderCell(content, options) {
    const cellClasses = classNames({
      'b-donation-goal-card-cell': true,
      'b-donation-goal-card-cell--grow': (options.grow === true),
      'b-donation-goal-card-cell--shrink': (options.shrink === true),
      'b-donation-goal-card-cell--no-shrink': (options.noShrink === true),
      'b-donation-goal-card-cell--with-border': (options.border === true),
      'b-donation-goal-card-cell--date': (options.date === true),
      'b-donation-goal-card-cell--progress': (options.progress === true)
    });
    return (
        <div className={cellClasses}>
          <div className="b-donation-goal-card-cell__content">
            <div className="b-donation-goal-card-cell-content">
              {content}
            </div>
          </div>
        </div>
    );
  }

  toggleActiveState() {
    const {donationGoal} = this.props;
    DonationGoalActions.requestDonationGoalSettingsUpdate({
      activeDonationGoalId: this.isActive() ? null : donationGoal.id
    });
  }

  showEditGoalModal() {
    const editAction = DonationGoalActions.requestDonationGoalUpdate;
    const modal = (
        <ModalDialogDonationGoal title={localizeString('DONATION_GOAL_DIALOG.TITLE_EDIT')} action={editAction}
                                 donationGoal={this.props.donationGoal}/>
    );
    ModalDialogActions.showModal(modal);
  }

  showDeleteGoalModal() {
    let modal = null;
    const title = localizeString('DONATION_GOAL_DELETE_DIALOG.TITLE');
    if (!this.isActive()) {
      const {donationGoal} = this.props;
      const text = sprintf(localizeString('DONATION_GOAL_DELETE_DIALOG.TEXT'), donationGoal.title);
      const confirmText = localizeString('MODAL_DIALOG.CONTROLS.YES');
      const cancelText = localizeString('MODAL_DIALOG.CONTROLS.NO');
      const deleteDonation = DonationGoalActions.requestDonationGoalDelete.bind(this, donationGoal.id);
      const controls = [
        {
          key: 'confirm',
          label: confirmText,
          action: deleteDonation
        },
        {
          key: 'cancel',
          label: cancelText,
          action: () => {
          }
        }
      ];
      modal = <ModalDialogConfirmation title={title} controls={controls} text={text}/>;
    } else {
      const text = localizeString('DONATION_GOAL_DELETE_DIALOG.UNABLE_TEXT');
      const closeText = localizeString('MODAL_DIALOG.CONTROLS.CLOSE');
      const controls = [
        {
          key: 'close',
          label: closeText,
          action: () => {}
        }
      ];
      modal = <ModalDialogConfirmation title={title} controls={controls} text={text}/>;
    }
    ModalDialogActions.showModal(modal);
  }

  isActive() {
    const {donationGoal, activeDonationGoalId} = this.props;
    return (activeDonationGoalId === donationGoal.id);
  }

  render() {
    const {title, currentAmount, goalAmount, endDate} = this.props.donationGoal;
    const active = this.isActive();
    const activationToggleIconType = active ? ACTION_TYPE.STOP : ACTION_TYPE.PLAY;
    const actions = (
        <div className="b-donation-goal-actions">
          <div className="b-donation-goal-actions__item">
            <ActionIcon type={activationToggleIconType} onAction={this.toggleActiveState} white={active}/>
          </div>
          <div className="b-donation-goal-actions__item">
            <ActionIcon type={ACTION_TYPE.EDIT} onAction={this.showEditGoalModal} white={active}/>
          </div>
          <div className="b-donation-goal-actions__item">
            <ActionIcon type={ACTION_TYPE.DELETE} onAction={this.showDeleteGoalModal} white={active}/>
          </div>
        </div>
    );
    const cardClasses = classNames({
      'b-donation-goal-card': true,
      'b-donation-goal-card--active': this.isActive()
    });
    return (
        <div className={cardClasses}>
          {this.renderCell(endDate, {border: true, date: true})}
          {this.renderCell(`${currentAmount}/${goalAmount} ${Constants.RUBLE}`, {border: true, progress: true})}
          {this.renderCell(title, {grow: true, shrink: true, border: true})}
          {this.renderCell(actions, {noShrink: true})}
        </div>
    );
  }
}

DashboardWidgetDonationGoalCard.propTypes = {
  donationGoal: DONATION_GOAL_TYPE,
  activeDonationGoalId: React.PropTypes.string
};

class DashboardWidgetsDonationGoalManagement extends DashboardSettingsForm {

  constructor(props) {
    super(props);
    this.addDonationGoal = this.addDonationGoal.bind(this);
  }

  componentWillMount() {
    super.componentWillMount();

    [DonationGoalActions.receiveDonationGoalCreation.id,
      DonationGoalActions.receiveDonationGoalUpdate.id,
      DonationGoalActions.receiveDonationGoalDelete.id]
        .forEach((action) => {
          this.actionListener.addActionListener(
              action, () => {
                DonationGoalActions.requestDonationGoals.defer();
                DonationGoalActions.requestDonationGoalSettings.defer();
              }
          );
        });
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromStore(nextProps.donationGoalStore);
  }

  getActionsToListen() {
    return [];
  }

  getStore() {
    return DonationGoalStore;
  }

  updateStateFromStore(donationGoalStoreState) {
    this.setState({
      donationGoals: donationGoalStoreState.donationGoals,
      activeDonationGoalId: donationGoalStoreState.donationGoalSettings.activeDonationGoalId
    });
  }

  addDonationGoal() {
    const limitReached = this.state.donationGoals.length >= Constants.DONATION_GOALS_LIMIT;
    let modal = null;
    const title = localizeString('DONATION_GOAL_DIALOG.TITLE_ADD');
    if (!limitReached) {
      const addAction = DonationGoalActions.requestDonationGoalCreation;
      modal = <ModalDialogDonationGoal title={title} action={addAction}/>;
    } else {
      const text = sprintf(localizeString('DONATION_GOAL_DIALOG.UNABLE_TEXT'), Constants.DONATION_GOALS_LIMIT);
      const closeText = localizeString('MODAL_DIALOG.CONTROLS.CLOSE');
      const modalControls = [
        {
          key: 'close',
          label: closeText,
          action: () => {}
        }
      ];
      modal = <ModalDialogConfirmation title={title} controls={modalControls} text={text}/>;
    }
    ModalDialogActions.showModal(modal);
  }

  renderDonationGoals() {
    const {donationGoals, activeDonationGoalId} = this.state;
    return donationGoals.map((donationGoal) => {
      return (
          <div className="b-donation-goal-card__item" key={donationGoal.id}>
            <DashboardWidgetDonationGoalCard donationGoal={donationGoal} activeDonationGoalId={activeDonationGoalId}/>
          </div>);
    });
  }

  renderAddGoal() {
    return (
        <div className="b-dashboard-settings-form__add-goal">
          <div className="b-dashboard-add-donation-goal">
            <Button text={localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.ADD')} onClick={this.addDonationGoal}/>
          </div>
        </div>
    );
  }

  render() {
    return (
        <div className="b-dashboard-settings-form">
          {this.renderHeader(localizeString('DASHBOARD_WIDGETS_DONATION_GOAL.TITLE_MANAGEMENT'))}
          {this.renderSeparator()}
          {this.renderAddGoal()}
          <div className="b-dashboard-settings-form__donation-goals">
            <div className="b-dashboard-donation-goals">
              {this.renderDonationGoals()}
            </div>
          </div>
        </div>
    );
  }
}

class DashboardWidgetsDonationGoal extends React.Component {

  componentDidMount() {
    DonationGoalActions.requestDonationGoalSettings.defer();
    DonationGoalActions.requestDonationGoals.defer();
  }

  render() {
    return (
        <div className="b-dashboard-category-content">
          <div className="b-dashboard-category-content__part b-dashboard-category-content__part--margin-bottom">
            <DashboardWidgetsDonationGoalSettings {...this.props}/>
          </div>
          <div className="b-dashboard-category-content__part b-dashboard-category-content__part--margin-bottom">
            <DashboardWidgetsDonationGoalManagement {...this.props}/>
          </div>
        </div>
    );
  }
}

DashboardWidgetsDonationGoal.propTypes = Object.assign({}, DashboardSettingsForm.propTypes, {
  authStore: React.PropTypes.shape({
    token: React.PropTypes.string.isRequired     // NULLNU
  }).isRequired
});

export default class DashboardWidgetsDonationGoalContainer extends React.Component {
  render() {
    return (
        <AltContainer stores={{donationGoalStore: DonationGoalStore}}>
          <DashboardWidgetsDonationGoal {...this.props}/>
        </AltContainer>
    );
  }
}
