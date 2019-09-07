import React from 'react';

import Constants from '../utils/Constants';

const MIN_RECONNECT_INTERVAL = 1;
const MAX_RECONNECT_INTERVAL = 2;

const HEARTBEAT_STRING = 'ping';
const HEARTBEAT_RESPONSE_STRING = 'pong';

const SETTINGS_RELOAD_STRING = 'RELOAD';

const INITIAL_HEARTBEAT_DELAY = 5;
const MIN_HEARTBEAT_INTERVAL = 6;
const MAX_HEARTBEAT_INTERVAL = 10;

const HEARBEAT_RESPONSE_TIMEOUT = 2 * MAX_HEARTBEAT_INTERVAL;

const WEBSOCKET_HEARTBEAT_TIMER = 'websocketHeartbeatTimer';
const RECREATE_WEBSOCKET_TIMER = 'recreateWebSocketTimer';

export default class DonationWidget extends React.Component {

  constructor(props) {
    super(props);

    this.createTimer = this.createTimer.bind(this);
    this.onConnectionEstablished = this.onConnectionEstablished.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  componentWillMount() {
    const websocket = this.createWebSocket();
    this.setState({
      websocket: websocket,
      lastPingResponseTimestamp: new Date(),
      [WEBSOCKET_HEARTBEAT_TIMER]: null,
      [RECREATE_WEBSOCKET_TIMER]: null
    });

    this.createWebSocketHeartbeat();
    this.scheduleReconnectWebSocket = function() {
      console.error('Connection closed');
      const reconnectDelay = MIN_RECONNECT_INTERVAL + ((MAX_RECONNECT_INTERVAL - MIN_RECONNECT_INTERVAL) * Math.random());
      this.createTimer(this.recreateWebSocket.bind(this), reconnectDelay, [RECREATE_WEBSOCKET_TIMER]);
    };
  }

  componentWillUnmount() {
    this.clearResources();
    this.closeWebSocket();
  }

  clearResources() {
    // release websocket resources!
    clearTimeout(this.state[WEBSOCKET_HEARTBEAT_TIMER]);
    clearTimeout(this.state[RECREATE_WEBSOCKET_TIMER]);
  }

  createTimer(timerFunction, delaySeconds, stateName) {
    const timer = setTimeout(timerFunction, delaySeconds * 1000);
    this.setState({[stateName]: timer});
  }

  getToken() {
    return this.props.location.query.token;
  }

  isTestMode() {
    return (this.props.location.query.testMode !== undefined);
  }

  // must be called only once in the beginning
  createWebSocketHeartbeat() {
    this.createTimer(this.webSocketHeartbeat.bind(this), INITIAL_HEARTBEAT_DELAY, WEBSOCKET_HEARTBEAT_TIMER);
  }

  // keeps connection alive
  webSocketHeartbeat() {
    const delay = MIN_HEARTBEAT_INTERVAL + (MAX_HEARTBEAT_INTERVAL - MIN_HEARTBEAT_INTERVAL) * Math.random();
    this.createTimer(this.webSocketHeartbeat.bind(this), delay, WEBSOCKET_HEARTBEAT_TIMER);
    const currentDate = new Date();
    if ((currentDate.getTime() - this.state.lastPingResponseTimestamp.getTime()) > HEARBEAT_RESPONSE_TIMEOUT * 1000) {
      console.error('Heartbeat response timeout');
      this.scheduleReconnectWebSocket();
      return;
    }
    if (this.state.websocket.readyState === WebSocket.OPEN) {
      console.log('Heartbeat');
      this.state.websocket.send(HEARTBEAT_STRING);
    } else if (this.state.websocket.readyState === WebSocket.CLOSED) {
      this.scheduleReconnectWebSocket();
    }
  }

  onConnectionEstablished() {
    console.warn('onConnectionEstablished() is not overridden');
  }

  onMessage() {
    console.warn('onMessage() is not overridden');
  }

  onSettingsReload() {
    console.warn('onSettingsReload() is not overridden');
  }

  getClientType() {
    console.warn('getClientType() is not overridden');
    return '';
  }

  appendToken() {
    const token = this.getToken();
    return '?token=' + token;
  }

  appendClientType() {
    return `&clientType=${this.getClientType()}`;
  }

  createWebSocket() {
    const self = this;
    const websocket = new WebSocket(Constants.WEBSOCKET_DONATION_URL + this.appendToken() + this.appendClientType());
    websocket.addEventListener('open', function() {
      console.log('Connection established');
      self.onConnectionEstablished();
    });
    websocket.addEventListener('message', function(event) {
      const message = event.data;
      console.log('Data: ' + event.data);
      if (message === HEARTBEAT_RESPONSE_STRING) {
        self.setState({
          lastPingResponseTimestamp: new Date()
        });
      } else if (message === SETTINGS_RELOAD_STRING) {
        self.onSettingsReload();
      } else {
        self.onMessage(event.data);
      }
    });
    return websocket;
  }

  recreateWebSocket() {
    // need to close websocket, othewise donation duplication may occur after reconnection
    this.closeWebSocket();
    const websocket = this.createWebSocket();
    this.setState({
      websocket: websocket,
      lastPingResponseTimestamp: new Date(),
    });
  }

  closeWebSocket() {
    const {websocket} = this.state;
    websocket.close();
  }
}

DonationWidget.propTypes = {
  location: React.PropTypes.shape({
    query: React.PropTypes.shape({
      token: React.PropTypes.string,
      testMode: React.PropTypes.any
    })
  })
};
