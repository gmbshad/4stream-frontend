import React from 'react';
import alt from '../../alt';
import ActionListeners from 'alt-utils/lib/ActionListeners';
import {sprintf} from 'sprintf-js';

import {DashboardMultiPartContent} from './DashboardContent';
import AuthStore from '../../stores/AuthStore';
import DonationsStore from '../../stores/DonationsStore';
import DonationsActions from '../../actions/DonationsActions';
import SettingsStore from '../../stores/SettingsStore';
import ModalDialogActions from '../../actions/ModalDialogActions';
import {DonationTable, SORTING_FIELD} from '../../components/DonationTable';
import {SORTING_ORDER} from '../../utils/Constants';
import Button from '../../components/Button';
import ModalDialogManualDonation from '../../components/modal/ModalDialogManualDonation';
import {localizeString} from '../../localization/LocalizationUtils';
import DashboardStatistics from './DashboardStatistics';

const DONATION_SHIFT_DIRECTION = {
  BACKWARD: 'backward',
  FORWARD: 'forward'
};

export default class DashboardDonations extends DashboardMultiPartContent {

  constructor(props) {
    super(props);

    this.DONATION_LIMIT = 10;
    this.shiftDonationsBackward = this.shiftDonations.bind(this, DONATION_SHIFT_DIRECTION.BACKWARD);
    this.shiftDonationsForward = this.shiftDonations.bind(this, DONATION_SHIFT_DIRECTION.FORWARD);
    this.addDonation = this.addDonation.bind(this);
    this.toggleSorting = this.toggleSorting.bind(this);
    this.requestFirstPage = this.requestFirstPage.bind(this);
  }

  componentWillMount() {
    this.setState({
      donations: null,
      timeZone: SettingsStore.getState().timeZone,
      sortBy: SORTING_FIELD.TIMESTAMP,
      sortOrder: SORTING_ORDER.DESC
    });

    this.actionListener = new ActionListeners(alt);
    this.actionListener.addActionListener(
        DonationsActions.receiveDonations.id, () => {
          const donations = DonationsStore.getState().donations;
          this.setState({donations});
        }
    );
    this.actionListener.addActionListener(
        DonationsActions.receiveDeleteDonation.id, () => {
          this.requestFirstPage();
        }
    );
    this.actionListener.addActionListener(
        DonationsActions.receiveAddManualDonation.id, () => {
          this.requestFirstPage();
        }
    );
  }

  componentDidMount() {
    this.requestFirstPage();
  }

  componentWillUnmount() {
    this.actionListener.removeAllActionListeners();
  }

  getFirstDonationIndex() {
    const {offset} = this.state.donations;
    return offset + 1;
  }

  getLastDonationIndex() {
    const {offset, donations} = this.state.donations;
    const currentDonationsNumber = donations.length;
    return offset + currentDonationsNumber;
  }

  getTotalDonationNumber() {
    return this.state.donations.total;
  }

  getDonationsPaginationInfo() {
    if (this.getTotalDonationNumber() === 0) {
      return localizeString('DASHBOARD_DONATIONS.NO_DONATIONS');
    }
    return sprintf(localizeString('DASHBOARD_DONATIONS.DONATION_INDEXES'), this.getFirstDonationIndex(),
        this.getLastDonationIndex(), this.getTotalDonationNumber());
  }

  requestFirstPage() {
    const {sortBy, sortOrder} = this.state;
    DonationsActions.requestDonations.defer({limit: this.DONATION_LIMIT, sortBy, sortOrder});
  }

  shiftDonations(direction) {
    const totalDonations = this.getTotalDonationNumber();
    if (totalDonations === 0) {
      return;
    }
    const {sortBy, sortOrder} = this.state;
    const {offset} = this.state.donations;
    if (direction === DONATION_SHIFT_DIRECTION.BACKWARD) {
      if (this.getFirstDonationIndex() !== 1) {
        const nextOffset = offset - this.DONATION_LIMIT;
        DonationsActions.requestDonations({offset: nextOffset, limit: this.DONATION_LIMIT, sortBy, sortOrder});
      }
    } else if (direction === DONATION_SHIFT_DIRECTION.FORWARD) {
      if (this.getLastDonationIndex() !== this.getTotalDonationNumber()) {
        const nextOffset = offset + this.DONATION_LIMIT;
        DonationsActions.requestDonations({offset: nextOffset, limit: this.DONATION_LIMIT, sortBy, sortOrder});
      }
    }
  }

  addDonation() {
    const recipientId = AuthStore.getState().userId;
    const recipientName = AuthStore.getState().userName;
    const title = localizeString('ADD_MANUAL_DONATION_DIALOG.TITLE');
    const addDonationModal = <ModalDialogManualDonation recipientId={recipientId} recipientName={recipientName} title={title}/>;
    ModalDialogActions.showModal(addDonationModal);
  }

  toggleSorting({sortBy, sortOrder}) {
    this.setState({
      sortBy, sortOrder
    });
    DonationsActions.requestDonations({limit: this.DONATION_LIMIT, sortBy, sortOrder});
  }

  renderPaginationButtons() {
    return (
      <div className="b-dashboard-donations-controls">
        <div className="b-dashboard-donations-controls__navigate-left">
          <Button text="" onClick={this.shiftDonationsBackward} fontAwesomeClass="fa-chevron-left"/>
        </div>
        <div className="b-dashboard-donations-controls__navigate-right">
          <Button text="" onClick={this.shiftDonationsForward} fontAwesomeClass="fa-chevron-right"/>
        </div>
        <div className="b-dashboard-donations-controls__add">
          <Button text={localizeString('DASHBOARD_DONATIONS.ADD')} onClick={this.addDonation}/>
        </div>
      </div>
    );
  }

  renderDonationTable() {
    const {donations, timeZone, sortBy, sortOrder} = this.state;
    if (donations === null) {
      return null;
    }
    const donationsMeta = this.getDonationsPaginationInfo();
    return (
        <div className="b-dashboard-donations">
          <div className="b-dashboard-donations__meta">
            <div className="b-dashboard-donations-meta">
              <div className="b-dashboard-donations-meta__description">
                {donationsMeta}
              </div>
              <div className="b-dashboard-donations-meta__pagination">
                {this.renderPaginationButtons()}
              </div>
            </div>
          </div>
          <div className="b-dashboard-donations__table">
            <DonationTable donations={donations.donations} timeZone={timeZone} sortBy={sortBy} sortOrder={sortOrder}
                onSortToggle={this.toggleSorting}/>
          </div>
        </div>
    );
  }

  getParts() {
    return [
      {
        header: localizeString('DASHBOARD_STATISTICS.TITLE'),
        content: <DashboardStatistics/>
      },
      {
        header: localizeString('DASHBOARD_DONATIONS.TITLE'),
        content: this.renderDonationTable()
      }
    ];
  }
}
