import React from 'react';
import classNames from 'classnames';

import DonationForm from '../DonationForm';
import ModalDialog from './ModalDialog';

export default class ModalDialogManualDonation extends ModalDialog {

  getParentClassNames() {
    return classNames('b-modal-dialog--donation', super.getParentClassNames());
  }

  getContentClassNames() {
    return classNames('b-modal-dialog__content--donation', super.getContentClassNames());
  }

  getPaymentMethodsMock() {
    return {
      webmoney: false,
      yandex: false,
      unitPay: false
    };
  }
  renderContent() {
    const {recipientId, recipientName} = this.props;
    const payMethods = this.getPaymentMethodsMock();
    return (
      <DonationForm recipientId={recipientId} recipientName={recipientName} withCancel manual paymentMethods={payMethods} 
                    onButtonClick={this.close}/>
    );
  }
}

ModalDialogManualDonation.propTypes = Object.assign({}, ModalDialog.propTypes, {
  recipientId: React.PropTypes.string.isRequired,
  recipientName: React.PropTypes.string.isRequired
});
