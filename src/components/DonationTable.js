/*eslint no-unused-vars: [2, { "varsIgnorePattern": "SoundStore" }]*/
import React from 'react';
import classNames from 'classnames';
import {sprintf} from 'sprintf-js';

import SoundStore from '../stores/SoundStore';
import DonationsActions from '../actions/DonationsActions';
import ModalDialogActions from '../actions/ModalDialogActions';
import {formatDateTime} from '../utils/DateUtils';
import SortArrow from '../components/SortArrow';
import ActionIcon from '../components/ActionIcon';
import {formatRubles} from '../utils/CurrencyUtils';
import {SORTING_ORDER} from '../utils/Constants';
import {DONATION_TYPE, DONATION_SIGNATURE} from '../utils/Constants';
import {ACTION_TYPE} from '../components/ActionIcon';
import {DONATION_PROP_TYPE} from '../utils/Types';
import ModalDialogConfirmation from './modal/ModalDialogConfirmation';
import ModalDialogDonationInformation from './modal/ModalDialogDonationInformation';
import {localizeString} from '../localization/LocalizationUtils';
import Constants from '../utils/Constants';

const SORTING_FIELD = {
  TIMESTAMP: 'timestamp',
  SENDER: 'sender',
  SUM: 'sum'
};

class DonationTableHeaderCell extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  getSortOrder() {
    if (!this.isColumnSortable()) {
      return null;
    }
    const {sortKey} = this.props;
    const {sortBy, sortOrder} = this.props.sorting;
    return (sortKey !== sortBy) ? null : sortOrder;
  }

  isColumnSortable() {
    return this.props.sortKey !== undefined;
  }

  handleClick() {
    if (!this.isColumnSortable()) {
      return;
    }
    const {sortKey} = this.props;
    const {sortBy, sortOrder, onSortToggle} = this.props.sorting;

    let newSortOrder = SORTING_ORDER.DESC;
    if (sortBy === sortKey) {
      newSortOrder = (sortOrder === SORTING_ORDER.ACS) ? SORTING_ORDER.DESC : SORTING_ORDER.ACS;
    }
    onSortToggle({
      sortBy: sortKey,
      sortOrder: newSortOrder
    });
  }

  render() {
    const {name} = this.props;

    const cellBlockClassName = 'b-donation-table-header-cell--' + name;
    const sortOrder = this.getSortOrder();
    const cellBlockClassNames = classNames({
      'b-donation-table-header-cell': true,
      [cellBlockClassName]: true,
      'b-donation-table-header-cell--cursor-pointer': this.isColumnSortable()
    });

    return (
        <div className={`b-donation-table-header__cell b-donation-table-header__cell--${name}`}>
          <div className={cellBlockClassNames} onClick={this.handleClick}>
            <div className="b-donation-table-header-cell__text">
              {this.props.text}
            </div>
            <div className="b-donation-table-header-cell__arrow">
              <SortArrow sortOrder={sortOrder}/>
            </div>
          </div>
        </div>
    );
  }
}

DonationTableHeaderCell.propTypes = {
  name: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
  sortKey: React.PropTypes.oneOf(Object.keys(SORTING_FIELD).map(key => SORTING_FIELD[key])),
  sorting: React.PropTypes.shape({
    sortBy: React.PropTypes.oneOf(Object.keys(SORTING_FIELD).map(key => SORTING_FIELD[key])).isRequired,
    sortOrder: React.PropTypes.oneOf(Object.keys(SORTING_ORDER).map(key => SORTING_ORDER[key])).isRequired,
    onSortToggle: React.PropTypes.func.isRequired
  })
};

class DonationTable extends React.Component {

  showModalRemoveDonation(donation) {
    const {id, sender, sum} = donation;
    const deleteDonationConfirmTitle = localizeString('REMOVE_DONATION_DIALOG.TITLE');
    const deleteDonationConfirmText =
        sprintf(localizeString('REMOVE_DONATION_DIALOG.TEXT'), sender, sum, Constants.RUBLE);
    const confirmText = localizeString('MODAL_DIALOG.CONTROLS.YES');
    const cancelText = localizeString('MODAL_DIALOG.CONTROLS.NO');
    const deleteDonation = DonationsActions.requestDeleteDonation.bind(this, {
      donationId: id
    });
    const modalControls = [
      {
        key: 'confirm',
        label: confirmText,
        action: deleteDonation
      },
      {
        key: 'cancel',
        label: cancelText,
        action: () => {}
      }
    ];
    const modal = (
        <ModalDialogConfirmation title={deleteDonationConfirmTitle} controls={modalControls} 
                                 text={deleteDonationConfirmText}/>
    );
    ModalDialogActions.showModal(modal);
  }

  showModalDonationInfo(donation, formattedDate) {
    const title = localizeString('DONATION_INFO_DIALOG.TITLE');
    const controls = [
      {
        key: 'close',
        label: localizeString('MODAL_DIALOG.CONTROLS.CLOSE'),
        action: () => {}
      }
    ];
    const modal = (
        <ModalDialogDonationInformation donation={donation} formattedDate={formattedDate}
                                        title={title} controls={controls}/>
    );
    ModalDialogActions.showModal(modal);
  }

  formatDonationType(type) {
    let adjustedType = type;
    if (type.startsWith(DONATION_TYPE.UNITPAY)) {
      adjustedType = DONATION_TYPE.UNITPAY;
    }
    return localizeString(`DONATION_TABLE.DONATION_TYPE.${adjustedType}`);
  }

  getRowCellClassNames(name, clickable) {
    const cellClassName = `b-donation-table-row__cell--${name}`;
    return classNames({
      'b-donation-table-row__cell': true,
      [cellClassName]: true,
      'b-donation-table-row__cell--clickable': clickable
    });
  }

  renderRow(donation) {
    const {id, timestamp, type, sender, sum, message, signature} = donation;
    const dateFormat = 'D MMMM YYYY, HH:mm';
    const formattedDate = formatDateTime(timestamp, this.props.timeZone, dateFormat);
    const showDonationInfo = this.showModalDonationInfo.bind(this, donation, formattedDate);
    const senderIcon = (signature === DONATION_SIGNATURE.TWITCH)
        ? <span className="fa fa-twitch">&nbsp;</span> : null;
    return (
        <div className="b-donation-table-row" key={id}>
          <div className={this.getRowCellClassNames('date', true)} onClick={showDonationInfo}>
            <div className="b-donation-table-row-cell">
              {formattedDate}
            </div>
          </div>
          <div className={this.getRowCellClassNames('sender', true)} onClick={showDonationInfo}>
            <div className="b-donation-table-row-cell">
              {senderIcon}
              {sender}
            </div>
          </div>
          <div className={this.getRowCellClassNames('sum', true)} onClick={showDonationInfo}>
            <div className="b-donation-table-row-cell">
              {formatRubles(sum)}
            </div>
          </div>
          <div className={this.getRowCellClassNames('type', true)} onClick={showDonationInfo}>
            <div className="b-donation-table-row-cell">
              {this.formatDonationType(type)}
            </div>
          </div>
          <div className={this.getRowCellClassNames('message', true)} onClick={showDonationInfo}>
            <div className="b-donation-table-row-cell">
              {message}
            </div>
          </div>
          <div className={this.getRowCellClassNames('actions', false)}>
            <div className="b-donation-table-row-actions">
              <div className="b-donation-table-row-actions__item">
                <ActionIcon type={ACTION_TYPE.INFO} onAction={showDonationInfo}/>
              </div>
              <div className="b-donation-table-row-actions__item">
                <ActionIcon type={ACTION_TYPE.DELETE} onAction={this.showModalRemoveDonation.bind(this, donation)}/>
              </div>
            </div>
          </div>
        </div>
    );
  }
  
  render() {
    const donationRows = this.props.donations.map(donation => this.renderRow(donation));
    const sorting = {
      sortBy: this.props.sortBy,
      sortOrder: this.props.sortOrder,
      onSortToggle: this.props.onSortToggle      
    };
    return (
        <div className="b-donation-table">
          <div className="b-donation-table-header">
            <DonationTableHeaderCell name="date" text={localizeString('DONATION_TABLE.HEADER.DATE')}
                                     sortKey={SORTING_FIELD.TIMESTAMP} sorting={sorting}/>
            <DonationTableHeaderCell name="sender" text={localizeString('DONATION_TABLE.HEADER.SENDER')}
                                     sortKey={SORTING_FIELD.SENDER} sorting={sorting}/>
            <DonationTableHeaderCell name="sum" text={localizeString('DONATION_TABLE.HEADER.AMOUNT')}
                                     sortKey={SORTING_FIELD.SUM} sorting={sorting}/>
            <DonationTableHeaderCell name="type" text={localizeString('DONATION_TABLE.HEADER.TYPE')}/>
            <DonationTableHeaderCell name="message" text={localizeString('DONATION_TABLE.HEADER.MESSAGE')}/>
            <DonationTableHeaderCell name="actions" text=""/>
          </div>
          <div className="b-donation-table-rows">
            {donationRows}
          </div>
        </div>
    );
  }
}

DonationTable.propTypes = {
  timeZone: React.PropTypes.string,
  sortBy: React.PropTypes.oneOf(Object.keys(SORTING_FIELD).map(key => SORTING_FIELD[key])).isRequired,
  sortOrder: React.PropTypes.oneOf(Object.keys(SORTING_ORDER).map(key => SORTING_ORDER[key])).isRequired,
  onSortToggle: React.PropTypes.func.isRequired,
  donations: React.PropTypes.arrayOf(DONATION_PROP_TYPE).isRequired
};

export {DonationTable, SORTING_FIELD, SORTING_ORDER};
