import React from 'react';
import classNames from 'classnames';
import alt from '../../alt';
import ActionListeners from 'alt-utils/lib/ActionListeners';

import ModalDialog from './ModalDialog';
import SoundActions from '../../actions/SoundActions';
import SoundStore from '../../stores/SoundStore';
import ActionIcon, {ACTION_TYPE} from '../../components/ActionIcon';
import {DONATION_PROP_TYPE} from '../../utils/Types';
import {formatRubles} from '../../utils/CurrencyUtils';
import {localizeString} from '../../localization/LocalizationUtils';
import {DONATION_SIGNATURE} from '../../utils/Constants';
import Constants from '../../utils/Constants';

const ROW_TYPE = {
  FIRST: 'first',
  MIDDLE: 'middle',
  LAST: 'last'
};

export default class ModalDialogDonationInformation extends ModalDialog {

  componentWillMount() {
    this.setState({
      isSoundPlaying: SoundStore.getState().isSoundPlaying
    });
    this.actionListener = new ActionListeners(alt);
    this.actionListener.addActionListener(
        SoundActions.soundStateChanged.id, (isPlaying) => {
          this.setState({
            isSoundPlaying: isPlaying
          });
        });
  }

  componentWillUnmount() {
    this.actionListener.removeAllActionListeners();
  }

  getParentClassNames() {
    return classNames('b-modal-dialog--donation-info', super.getParentClassNames());
  }

  renderInfoRow(label, content, rowType, href) {
    const rowClassNames = classNames({
      'b-modal-dialog-donation-info__row': true,
      'b-modal-dialog-donation-info__row--first': rowType === ROW_TYPE.FIRST,
      'b-modal-dialog-donation-info__row--last': rowType === ROW_TYPE.LAST
    });
    const rowContentClassNames = classNames({
      'b-modal-dialog-donation-info-row-content': true
    });
    const rowValue = (href === undefined) ? content : (
        <a className="b-modal-dialog-donation-info-row-content-sender-link" href={href} target="_blank">{content}</a>
    );
    return (
        <div className={rowClassNames}>
          <div className="b-modal-dialog-donation-info-row">
            <div className="b-modal-dialog-donation-info-row-label">
              {label}:
            </div>
            <div className={rowContentClassNames}>
              {rowValue}
            </div>
          </div>
        </div>
    );
  }

  close() {
    super.close();
    SoundActions.stopSound();
  }

  formatDonationType(type) {
    return localizeString(`DONATION_INFO_DIALOG.TYPE.${type}`);
  }

  getSpeechContent(donationId, hasSpeech) {
    if (!hasSpeech) {
      return localizeString('DONATION_INFO_DIALOG.NO_SPEECH');
    }
    const playDonation = SoundActions.playDonationSpeech.bind(this, {
      donationId: donationId
    });
    const stopSound = SoundActions.stopSound;
    const {isSoundPlaying} = this.state;
    return (!isSoundPlaying) 
        ? <ActionIcon type={ACTION_TYPE.PLAY} onAction={playDonation}/>
        : <ActionIcon type={ACTION_TYPE.STOP} onAction={stopSound}/>;
  }

  renderContent() {
    const {donation, formattedDate} = this.props;
    const speechContent = this.getSpeechContent(donation.id, donation.hasSpeech);
    const senderLink = (donation.signature === DONATION_SIGNATURE.NONE) ? undefined
        : `${Constants.TWITCH_URL}/${donation.sender}`;
    return (
        <div className="b-modal-dialog-donation-info">
          {this.renderInfoRow(localizeString('DONATION_INFO_DIALOG.DONATION_ID'), donation.id, ROW_TYPE.FIRST)}
          {this.renderInfoRow(localizeString('DONATION_INFO_DIALOG.DATE'), formattedDate)}
          {this.renderInfoRow(localizeString('DONATION_INFO_DIALOG.TYPE_LABEL'), this.formatDonationType(donation.type))}
          {this.renderInfoRow(localizeString('DONATION_INFO_DIALOG.SENDER'), donation.sender, ROW_TYPE.MIDDLE, senderLink)}
          {this.renderInfoRow(localizeString('DONATION_INFO_DIALOG.AMOUNT'), formatRubles(donation.sum))}
          {this.renderInfoRow(localizeString('DONATION_INFO_DIALOG.MESSAGE'), donation.message)}
          {this.renderInfoRow(localizeString('DONATION_INFO_DIALOG.SPEECH'), speechContent, ROW_TYPE.LAST)}
        </div>
    );
  }
}

ModalDialogDonationInformation.propTypes = Object.assign({}, ModalDialog.propTypes, {
  donation: DONATION_PROP_TYPE.isRequired,
  formattedDate: React.PropTypes.string.isRequired
});
