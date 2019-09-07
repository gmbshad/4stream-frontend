import moment from 'moment-timezone/builds/moment-timezone-with-data-2010-2020';
import 'moment/locale/ru';

moment.locale('ru');

function formatDateTime(timestamp) {
  const date = moment(timestamp);
  return date.format('LLL');
}

export {formatDateTime};

