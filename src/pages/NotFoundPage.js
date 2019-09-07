import React from 'react';

import BasePage from '../layout/BasePage';
import {localizeString} from '../localization/LocalizationUtils';
import ResourceNotFound from '../components/ResourceNotFound';

export default class NotFoundPage extends BasePage {

  renderContent() {
    return (
        <div className="b-page-not-found">
          <div className="b-page-not-found__resource">
            <ResourceNotFound text={localizeString('PAGE_NOT_FOUND.TEXT')}/>
          </div>
        </div>
    );
  }
}

