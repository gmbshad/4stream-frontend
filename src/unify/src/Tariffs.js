/*global $*/
import {sprintf} from 'sprintf-js';

import {localizeString} from '../../localization/LocalizationUtils';
import {calculateAmountWithFee} from '../../utils/FeeCalculator';
import Constants from '../../utils/Constants';
import {DONATION_TYPE} from '../../utils/Constants';
import {getDonationFormAmountValidation} from '../../utils/Validations';

function refreshFeeCalculation() {
  const feeCalculatorAmount = $('#inputAmount').val();
  const feeCalculatorPaymentType = $('#inputPaymentType').val();
  const inputValidation =
      getDonationFormAmountValidation(Constants.DEFAULT_MIN_DONATION_AMOUNT, Constants.MAX_DONATION_AMOUNT);
  const feeCalculatorInputValid = inputValidation.func(feeCalculatorAmount);

  let result = 0.0;
  if (feeCalculatorInputValid) {
    result = calculateAmountWithFee(feeCalculatorPaymentType, feeCalculatorAmount);
  }
  const formattedResult = result.toFixed(2);
  let walletStringId = 'TARIFFS_PAGE.';
  if (feeCalculatorPaymentType === DONATION_TYPE.WEBMONEY) {
    walletStringId += 'FEE_CALCULATOR_WALLET_WEBMONEY';
  } else if (feeCalculatorPaymentType === DONATION_TYPE.YANDEX_WALLET ||
      feeCalculatorPaymentType === DONATION_TYPE.YANDEX_CREDIT_CARD) {
    walletStringId += 'FEE_CALCULATOR_WALLET_YANDEX';
  } else {
    walletStringId += 'FEE_CALCULATOR_WALLET_QIWI';
  }
  const walletString = localizeString(walletStringId);
  const estimate1 = localizeString('TARIFFS_PAGE.FEE_CALCULATOR_ESTIMATE_1');
  const estimate2 = sprintf(localizeString('TARIFFS_PAGE.FEE_CALCULATOR_ESTIMATE_2'), walletString);
  const estimate3 = sprintf(localizeString('TARIFFS_PAGE.FEE_CALCULATOR_ESTIMATE_3'), formattedResult, Constants.RUBLE);
  $('#calculatedFeeDescription').text(estimate1 + ' ' + estimate2);
  $('#calculatedFeeAmount').text(estimate3);
  const inputAmountGroup = $('#inputAmountGroup');
  const errorClass = 'has-error';
  if (feeCalculatorInputValid && inputAmountGroup.hasClass(errorClass)) {
    inputAmountGroup.removeClass(errorClass);
  } else if (!feeCalculatorInputValid && !inputAmountGroup.hasClass(errorClass)) {
    inputAmountGroup.addClass(errorClass);
  }
}

export {refreshFeeCalculation};
