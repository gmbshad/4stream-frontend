// Babel polyfill
import 'babel-polyfill';

// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { browserHistory } from 'react-router';

// Routes
import Routes from './layout/Routes';

// Base styling
import './stylesheets/main.scss';
import 'react-notifications/lib/notifications.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'animate.css/animate.css';

// Recursive resources referencing
require.context('../resources', true, /.*/);

// ID of the DOM element to mount app on
const DOM_APP_EL_ID = 'stream-assist';

// Render the router
ReactDOM.render((
  <Router history={browserHistory}>
    {Routes}
  </Router>
), document.getElementById(DOM_APP_EL_ID));
