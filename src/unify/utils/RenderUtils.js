/*global $*/
import {sprintf} from 'sprintf-js';

import {localizeString} from '../../localization/LocalizationUtils';
import {PAYMENT_TYPE, DIRECT_PAYMENTS, UNITPAY_PAYMENTS, FEE_CONSTANT_RECEIVE, WITHDRAW_FEE}
    from '../../utils/FeeCalculator';
import Constants from '../../utils/Constants';

function formatCommission(commission, constantFee) {
  let formattedCommission = `${((commission * 100).toFixed(1))}%`;
  if (constantFee !== 0.0) {
    formattedCommission += ` + ${constantFee} ${Constants.RUBLE}`;
  }
  return formattedCommission;
}

function renderPaymentsTable(data, constantFee) {
  let rowsHtml = '';
  Object.keys(data).forEach(paymentType => {
    const paymentTypeLabel = PAYMENT_TYPE[paymentType];
    const formattedCommission = formatCommission(data[paymentType], constantFee);
    rowsHtml += `
      <tr>
        <td class="col-md-6">${localizeString(`TARIFFS_PAGE.PAYMENT_TYPE.${paymentTypeLabel}`)}</td>
        <td class="col-md-6">${formattedCommission}</td>
      </tr>
    `;
  });
  return (
      `
          <!--Table Striped-->
					<table class="table table-striped">
						<thead>
							<tr>
								<th>${localizeString('TARIFFS_PAGE.TARIFFS_TABLE.PAYMENT_TYPE')}</th>
								<th>${localizeString('TARIFFS_PAGE.TARIFFS_TABLE.COMMISSION')}</th>
							</tr>
						</thead>
						<tbody>
							${rowsHtml}
						</tbody>
					</table>
      `
  );
}

function renderDirectPaymentsTable() {
  return renderPaymentsTable(DIRECT_PAYMENTS, FEE_CONSTANT_RECEIVE);
}

function renderUnitpayPaymentsTable() {
  return renderPaymentsTable(UNITPAY_PAYMENTS, FEE_CONSTANT_RECEIVE);
}

function renderPaymentsWithdrawTable() {
  return renderPaymentsTable(WITHDRAW_FEE, 0);
}

function renderDirectPaymentsText() {
  return sprintf(localizeString('TARIFFS_PAGE.DIRECT_PAYMENTS_CONTENT'), localizeString('PAYMENT_DIALOG.TITLE'));
}

function renderUnitpayPaymentsText() {
  return sprintf(localizeString('TARIFFS_PAGE.AGGREGATOR_PAYMENTS_CONTENT'), localizeString('PAYMENT_DIALOG.TITLE'));
}

function renderPaymentOptionGroups() {
  const renderPaymentOptions = function(paymentsObject, paymentCategory) {
    let paymentOptionsHtml = '';
    Object.keys(paymentsObject).forEach((key) => {
      const paymentTypeLabel = PAYMENT_TYPE[key];
      const label = sprintf(localizeString(paymentCategory),
          localizeString(`TARIFFS_PAGE.PAYMENT_TYPE.${paymentTypeLabel}`));
      paymentOptionsHtml += `<option value="${key}">${label}</option>`;
    });
    return paymentOptionsHtml;
  };
  const paymentTypes = [
    {
      label: localizeString('TARIFFS_PAGE.FEE_CALCULATOR_DIRECT_PAYMENT'),
      options: renderPaymentOptions(DIRECT_PAYMENTS, 'TARIFFS_PAGE.PAYMENT_TYPE_DETAILED.DIRECT')
    },
    {
      label: localizeString('TARIFFS_PAGE.FEE_CALCULATOR_AGGREGATOR_PAYMENT'),
      options: renderPaymentOptions(UNITPAY_PAYMENTS, 'TARIFFS_PAGE.PAYMENT_TYPE_DETAILED.AGGREGATOR')
    }
  ];
  let paymentOptionGroupsHtml = '';
  paymentTypes.forEach((group) => {
    paymentOptionGroupsHtml += `<optGroup label="${group.label}">`;
    paymentOptionGroupsHtml += group.options;
    paymentOptionGroupsHtml += `</optGroup>`;
  });
  return paymentOptionGroupsHtml;
}


function renderFeeCalculator() {
  return `
      <!-- Inline Form -->
      <div class="panel panel-blue">
        <div class="panel-heading">
          <h3 class="panel-title">
            <i class="fa fa-calculator"></i>
            ${localizeString('TARIFFS_PAGE.FEE_CALCULATOR_HEADER')}
          </h3>
        </div>
        <div class="panel-body">
          <form role="form">
            <div class="row">
              <div id="inputAmountGroup" class="form-group col-md-6">
                <label for="inputAmount">
                  ${localizeString('TARIFFS_PAGE.FEE_CALCULATOR_AMOUNT')}
                </label>
                <input id="inputAmount" value="100" maxlength="5" class="form-control" autoComplete="off">
              </div>
              <div class="form-group col-md-6">
                <label for="inputPaymentType">
                  ${localizeString('TARIFFS_PAGE.FEE_CALCULATOR_PAYMENT_TYPE')}
                </label>
                <select id="inputPaymentType" class="form-control">
                  ${renderPaymentOptionGroups()}
                </select>
              </div>
            </div>
            <div>
                <span id="calculatedFeeDescription"></span>&nbsp;<b><span id="calculatedFeeAmount"></span></b>
            </div>
          </form>
        </div>
      </div>
			<!-- End Inline Form -->
  `;
}

export {renderDirectPaymentsTable, renderUnitpayPaymentsTable, renderPaymentsWithdrawTable,
    renderDirectPaymentsText, renderUnitpayPaymentsText, renderFeeCalculator};
