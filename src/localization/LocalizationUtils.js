import {LOCALE} from './Locales';

const LOCALE_TRANSLATIONS = {};

// ru
import RU from './strings/ru';
LOCALE_TRANSLATIONS[LOCALE.RU] = RU;

// en
import EN from './strings/en';
LOCALE_TRANSLATIONS[LOCALE.EN] = EN;

function localizeFail(key, locale) {
  console.error(`Unable to localize by key '${key}' for locale '${locale}'`);
  return '';
}

function localize(key, validationFunction) {
  // when several localizations exist, locale should be taken from LocalizationStore,
  // BUT LocalizationUtils must not depend on LocalizationStore
  const locale = LOCALE.RU;

  let currentObject = LOCALE_TRANSLATIONS[locale];
  const keyTokens = key.split('.');
  keyTokens.forEach((token) => {
    if (currentObject[token] === undefined) {
      return localizeFail(key, locale);
    }
    currentObject = currentObject[token];
  });
  if (validationFunction(currentObject)) {
    return currentObject;
  }
  return localizeFail(key, locale);
}

function localizeString(key) {
  return localize(key, (currentObject) => (typeof currentObject === 'string' || currentObject instanceof String));
}

function localizeStringArray(key) {
  return localize(key, (currentObject) => (Array.isArray(currentObject)));
}

export {localizeString, localizeStringArray};
