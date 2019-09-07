import {sprintf} from 'sprintf-js';

import {parseInteger} from './MathUtils';
import {localizeString} from '../localization/LocalizationUtils';
import Constants from './Constants';


function isInteger(value) {
  const valueInt = parseInteger(value);
  return !Number.isNaN(valueInt);
}

function isGreaterOrEquals(value, bound) {
  return isInteger(value) && parseInteger(value) >= bound;
}

function isLessOrEquals(value, bound) {
  return isInteger(value) && parseInteger(value) <= bound;
}

function countRegexMatches(value, regex) {
  return (value.match(regex) || []).length;
}

function getMockValidation() {
  return {
    func: () => true,
    message: () => localizeString('VALIDATIONS.MOCK')
  };
}

function getDonationFormAmountValidation(minAmount, maxAmount) {
  return {
    func: (value) => {
      return isGreaterOrEquals(value, minAmount) && isLessOrEquals(value, maxAmount);
    },
    message: (value) => {
      let message = '';
      if (!isInteger(value)) {
        message = localizeString('VALIDATIONS.INCORRECT_AMOUNT');
      } else {
        const valueInt = parseInteger(value);
        message = (valueInt < minAmount) ? sprintf(localizeString('VALIDATIONS.MIN_AMOUNT'), minAmount, Constants.RUBLE)
            : sprintf(localizeString('VALIDATIONS.MAX_AMOUNT'), maxAmount, Constants.RUBLE);
      }
      return message;
    }
  };
}

function getWebMoneyWalletValidation() {
  return {
    func: (value) => {
      return (/^[rR](\d{12})$/).test(value);
    },
    message: () => localizeString('VALIDATIONS.WEBMONEY_WALLET')
  };
}

function getYandexWalletValidation() {
  return {
    func: (value) => {
      return (/^41001(\d{1,11})$/).test(value);
    },
    message: () => localizeString('VALIDATIONS.YANDEX_WALLET')
  };
}

function getQiwiWalletValidation() {
  return {
    func: (value) => {
      return (/^\+(7|77|380|372|373|374|994|82|507|370|371|996|9955|992|44|998|972|66|90|91)[0-9]{6,14}$/).test(value);
    },
    message: () => localizeString('VALIDATIONS.QIWI_WALLET')
  };
}

function getMinDonationAmountValidation(lowerBound, upperBound) {
  return {
    func: (value) => {
      return isGreaterOrEquals(value, lowerBound) && isLessOrEquals(value, upperBound);
    },
    message: (value) => {
      let message = '';
      if (!isInteger(value)) {
        message = localizeString('VALIDATIONS.INCORRECT_AMOUNT');
      } else {
        const valueInt = parseInteger(value);
        message = (valueInt < lowerBound)
            ? sprintf(localizeString('VALIDATIONS.MIN_AMOUNT'), lowerBound, Constants.RUBLE)
            : sprintf(localizeString('VALIDATIONS.MAX_AMOUNT'), upperBound, Constants.RUBLE);
      }
      return message;
    }
  };
}

function getMinTTSAmountValidation(currentMinAmountFunction, upperBound) {
  return {
    func: (value) => {
      return isGreaterOrEquals(value, currentMinAmountFunction()) && isLessOrEquals(value, upperBound);
    },
    message: (value) => {
      let message = '';
      if (!isInteger(value)) {
        message = localizeString('VALIDATIONS.INCORRECT_AMOUNT');
      } else {
        const valueInt = parseInteger(value);
        message = (valueInt < currentMinAmountFunction())
            ? localizeString('VALIDATIONS.INCORRECT_TTS_AMOUNT')
            : sprintf(localizeString('VALIDATIONS.MAX_AMOUNT'), upperBound, Constants.RUBLE);
      }
      return message;
    }
  };
}

function getIntegerBoundsValidation(min, max) {
  return {
    func: (value) => {
      return isGreaterOrEquals(value, min) && isLessOrEquals(value, max);
    },
    message: () => {
      return sprintf(localizeString('VALIDATIONS.INTEGER_VALUE'), min, max);
    }
  };
}

function getDonationTitleTemplateValidation() {
  return {
    func: (value) => {
      return countRegexMatches(value, (/\{sender\}/g)) === 1 && countRegexMatches(value, (/\{amount\}/g)) === 1 &&
          countRegexMatches(value, (/\{/g)) === 2 && countRegexMatches(value, (/\}/g)) === 2;
    },
    message: () => {
      return localizeString('VALIDATIONS.INCORRECT_TEMPLATE');
    }
  };
}

function getColorValidation() {
  return {
    func: (value) => {
      return (value && value.length === 7 && countRegexMatches(value, (/^#([a-f\d]{6})/i)) === 2);
    },
    message: () => {
      return localizeString('VALIDATIONS.INCORRECT_COLOR');
    }
  };
}

export {getDonationFormAmountValidation, getWebMoneyWalletValidation, getYandexWalletValidation, getQiwiWalletValidation,
    getMinDonationAmountValidation, getIntegerBoundsValidation, getDonationTitleTemplateValidation, getMockValidation,
    getMinTTSAmountValidation, getColorValidation};

