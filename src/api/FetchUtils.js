import React from 'react';

import Constants from '../utils/Constants';
import {doFetch} from './FetchRequest';
import {getDashboardLoginUrl} from '../utils/Auth';
import ModalDialogActions from '../actions/ModalDialogActions';
import ModalDialogConfirmation from '../components/modal/ModalDialogConfirmation';
import {localizeString} from '../localization/LocalizationUtils';
import {navigateToExternal} from '../utils/NavigationUtils';

function showUnauthorizedModal() {
  const title = localizeString('SESSION_EXPIRED_DIALOG.TITLE');
  const text = localizeString('SESSION_EXPIRED_DIALOG.TEXT');
  const modalControls = [
    {
      key: 'confirm',
      label: localizeString('MODAL_DIALOG.CONTROLS.YES'),
      action: () => {
        window.open(getDashboardLoginUrl(), '_self');
      }
    },
    {
      key: 'cancel',
      label: localizeString('MODAL_DIALOG.CONTROLS.NO'),
      action: () => {
        navigateToExternal(Constants.BASE_URL);
      }
    }
  ];
  const modal = (
      <ModalDialogConfirmation title={title} controls={modalControls} text={text}/>
  );
  ModalDialogActions.showModal(modal);
}


function fetchGet(url, data, cors) {
  return doFetch({url, method: 'GET', data, cors, unauthorizedHandler: showUnauthorizedModal});
}

function fetchPost(url, data) {
  return doFetch({url, method: 'POST', data, unauthorizedHandler: showUnauthorizedModal});
}

function fetchPut(url, data) {
  return doFetch({url, method: 'PUT', data, unauthorizedHandler: showUnauthorizedModal});
}

function fetchDelete(url, data) {
  return doFetch({url, method: 'DELETE', data, unauthorizedHandler: showUnauthorizedModal});
}

export {fetchGet, fetchPost, fetchPut, fetchDelete};
