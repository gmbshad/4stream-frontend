import React from 'react';

import {localizeString} from '../localization/LocalizationUtils';
import Button from '../components/Button';
import {navigateToExternal} from '../utils/NavigationUtils';

export default class ResourceNotFound extends React.Component {

  render() {
    const toLandingPage = () => {
      navigateToExternal('/');
    };

    return (
        <div className="b-resource-not-found">
          <div className="b-resource-not-found__code">
            <div className="b-resource-not-found-code">
              404
            </div>
          </div>
          <div className="b-resource-not-found__text">
            <div className="b-resource-not-found-text">
              {this.props.text}
            </div>
          </div>
          <div className="b-resource-not-found__landing-button">
            <Button text={localizeString('RESOURCE_NOT_FOUND.LANDING_BUTTON')} wide increasedPadding onClick={toLandingPage}/>
          </div>
        </div>
    );
  }
}

ResourceNotFound.propTypes = {
  text: React.PropTypes.string.isRequired
};

