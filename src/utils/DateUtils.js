import moment from 'moment-timezone/builds/moment-timezone-with-data-2010-2020';
import 'moment/locale/ru';

import {localizeStringArray} from '../localization/LocalizationUtils';

moment.locale('ru');

const TIME_INTERVALS = {
  DAY: 'day',
  MONTH: 'month',
  WEEK: 'week',
  YEAR: 'year'
};

const DATE_FORMAT = 'YYYY-MM-DD';

const DAYS_OF_WEEK = localizeStringArray('DATE_UTILS.DAYS_OF_WEEK');
const DAYS_OF_WEEK_SHORT = localizeStringArray('DATE_UTILS.DAYS_OF_WEEK_SHORT');
const MONTHS_OF_YEAR = localizeStringArray('DATE_UTILS.MONTHS_OF_YEAR');
const MONTHS_OF_YEAR_SHORT = localizeStringArray('DATE_UTILS.MONTHS_OF_YEAR_SHORT');

function formatDateTime(timestamp, timeZone, format) {
  const desiredFormat = format ? format : 'LLL';
  const date = (timeZone !== null) ? moment.tz(timestamp, timeZone) : moment(timestamp);
  return date.format(desiredFormat);
}

function formatUTCDate(date, excludeDay) {
  const format = excludeDay ? 'MMMM YYYY' : 'D MMMM YYYY';
  return moment(date.getTime()).utc().format(format);
}

function formatUTCISODate(date) {
  return moment(date.getTime()).utc().format('YYYY-MM-DD');
}

function copyDate(date) {
  return new Date(date.getTime());
}

function addDays(date, daysNumber) {
  return moment(date.getTime()).add(daysNumber, 'days').toDate();
}

function addMonths(date, monthsNumber) {
  return moment(date.getTime()).add(monthsNumber, 'months').toDate();
}

function addYears(date, yearsNumber) {
  return moment(date.getTime()).add(yearsNumber, 'years').toDate();
}

function getStartOfDayUTC(date) {
  return moment(date.getTime()).utc().startOf('day').toDate();
}

function getStartOfWeekUTC(date) {
  return moment(date.getTime()).utc().startOf('week').toDate();
}

function getStartOfMonthUTC(date) {
  return moment(date.getTime()).utc().startOf('month').toDate();
}

function getStartOfYearUTC(date) {
  return moment(date.getTime()).utc().startOf('year').toDate();
}

function getMoment() {
  return moment();
}

function getMomentFromDate(date, format) {
  return moment(date, format);
}

// get time zone offset for current timestamp
function getTimeZoneOffset(timeZone) {
  if (!timeZone) {
    return new Date().getTimezoneOffset();
  }
  return moment.tz.zone(timeZone).offset(new Date().getTime());
}

function addMinutes(date, minutes) {
  return moment(date.getTime()).add(minutes, 'minutes').toDate();
}

function differenceInDaysFromNow(date) {
  const nowMoment = moment().startOf('day');
  const dateMoment = moment(date, DATE_FORMAT);
  return dateMoment.diff(nowMoment, 'days');
}

function differenceInMinutesFromNow(timestamp) {
  const nowMoment = moment();
  const anotherMoment = moment(timestamp);
  return nowMoment.diff(anotherMoment, 'minutes');
}


function getDateSeveralDaysFromNow(days) {
  return moment().add(days, 'days').format(DATE_FORMAT);
}

export {TIME_INTERVALS, DAYS_OF_WEEK, DAYS_OF_WEEK_SHORT, MONTHS_OF_YEAR, MONTHS_OF_YEAR_SHORT,
    formatDateTime, getTimeZoneOffset, addMinutes, formatUTCDate, copyDate,
    addDays, getStartOfDayUTC, getStartOfWeekUTC, getStartOfMonthUTC, getStartOfYearUTC, 
    addMonths, addYears, formatUTCISODate, differenceInDaysFromNow, getDateSeveralDaysFromNow,
    getMoment, getMomentFromDate, differenceInMinutesFromNow};
