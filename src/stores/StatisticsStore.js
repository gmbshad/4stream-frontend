import alt from '../alt';

import {fetchGet} from '../api/FetchUtils';
import StatisticsActions from '../actions/StatisticsActions';
import Constants from '../utils/Constants';

class StatisticsStore {

  setStatistics(statistics) {
    this.setState({statistics});
  }
  
  resetStatistics() {
    this.setStatistics(null);
  }
  
  constructor() {
    this.bindActions(StatisticsActions);
    this.statistics = null;
  }

  onRequestStatistics({date, interval, timeZoneOffset, showRemoved}) {
    const url =
        `${Constants.DONATION_API_URL_STATISTICS}?date=${date}&interval=${interval}&timeZoneOffset=${timeZoneOffset}` +
            `&showRemoved=${showRemoved}`;
    fetchGet(url)
        .then((response) => response.json())
        .then((json) => {
          if (json.statistics === undefined) {
            throw Error('Response JSON does not contain statistics: ' + JSON.stringify(json));
          }
          StatisticsActions.receiveStatistics(json.statistics);
        })
        .catch(function(error) {
          StatisticsActions.receiveStatisticsError(error);
        });
  }

  onReceiveStatistics(statistics) {
    this.setStatistics(statistics);
  }
  
  onReceiveStatisticsError(error) {
    console.error('DONATION_API_URL_STATISTICS failed:', error);
    this.resetStatistics();
  }
}

export default alt.createStore(StatisticsStore, 'StatisticsStore');
