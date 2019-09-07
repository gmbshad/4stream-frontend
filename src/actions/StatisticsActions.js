import alt from '../alt';

class StatisticsActions {

  requestStatistics({date, interval, timeZoneOffset, showRemoved}) {
    return {date, interval, timeZoneOffset, showRemoved};
  }

  receiveStatistics(statistics) {
    return statistics;
  }

  receiveStatisticsError(error) {
    return error;
  }
}

export default alt.createActions(StatisticsActions);
