import React from 'react';
import classNames from 'classnames';

import Header from './Header';
import Footer from './Footer';

export default class BasePage extends React.Component {
  renderHeader() {
    if (this.displayNoHeader()) {
      return null;
    }
    return <Header/>;
  }

  renderContent() {
    return null;
  }

  renderFooter() {
    return <Footer/>;
  }

  // may be overridden, if true then header is not displayed
  displayNoHeader() {
    return false;
  }

  // may be overridden, if true then padding is 0
  noPadding() {
    return false;
  }

  // may be overridden
  renderRemark() {
    return null;
  }
  
  render() {
    const contentClassNames = classNames({
      'b-page-container__content': true,
      'b-page-container__content--no-header': this.displayNoHeader(),
      'b-page-container__content-no-padding': this.noPadding()
    });
    return (
        <div className="b-page-container">
          <div className="b-page-container__header">
            {this.renderHeader()}
          </div>
          <div className={contentClassNames}>
            {this.renderContent()}
          </div>
          <div className="b-page-container__footer">
            {this.renderFooter()}
          </div>
          <div className="b-page-container__remark">
            {this.renderRemark()}
          </div>
        </div>
    );
  }
}

BasePage.propTypes = {
  location: React.PropTypes.shape({
    query: React.PropTypes.shape({
      error: React.PropTypes.string
    })
  })
};
