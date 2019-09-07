import { browserHistory } from 'react-router';

function getCurrentLocation() {
  return window.location.pathname;
}

function navigateTo(route) {
  browserHistory.push(route);
}

function navigateToExternal(url) {
  window.location = url;
}

function getLastRoute(component) {
  const routes = component.props.routes;
  return routes[routes.length - 1];
}

export {getCurrentLocation, navigateTo, navigateToExternal, getLastRoute};
