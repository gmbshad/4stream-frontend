import React from 'react';

import {DONATION_TYPE, DONATION_SIGNATURE} from './Constants';

const DONATION_PROP_TYPE = React.PropTypes.shape({
  id: React.PropTypes.string.isRequired,
  timestamp: React.PropTypes.number.isRequired,
  sender: React.PropTypes.string.isRequired,
  recipientId: React.PropTypes.string.isRequired,
  sum: React.PropTypes.number.isRequired,
  message: React.PropTypes.string,
  hasSpeech: React.PropTypes.bool.isRequired,
  type: React.PropTypes.oneOf(Object.keys(DONATION_TYPE).map(key => DONATION_TYPE[key])).isRequired,
  signature: React.PropTypes.oneOf(Object.keys(DONATION_SIGNATURE).map(key => DONATION_SIGNATURE[key])).isRequired
});

const NEWS_PROP_TYPE = React.PropTypes.arrayOf(React.PropTypes.shape({
  id: React.PropTypes.string.isRequired,
  timestamp: React.PropTypes.number.isRequired,
  title: React.PropTypes.string,
  content: React.PropTypes.string
}));

const DONATION_GOAL_TYPE = React.PropTypes.shape({
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  goalAmount: React.PropTypes.number.isRequired,
  currentAmount: React.PropTypes.number.isRequired,
  endDate: React.PropTypes.string
});

const FONT_SETTINGS_TYPE = React.PropTypes.shape({
  fontFamily: React.PropTypes.string.isRequired,
  fontSize: React.PropTypes.number.isRequired,
  fontColor: React.PropTypes.string.isRequired,
  shadowSize: React.PropTypes.number.isRequired,
  shadowColor: React.PropTypes.string.isRequired,
  backgroundColor: React.PropTypes.string.isRequired,
  backgroundOpacity: React.PropTypes.number.isRequired,
  animation: React.PropTypes.string,
});

export {DONATION_PROP_TYPE, NEWS_PROP_TYPE, DONATION_GOAL_TYPE, FONT_SETTINGS_TYPE};
