import React from 'react';
import classNames from 'classnames';

import Constants from '../utils/Constants';
import {localizeString} from '../localization/LocalizationUtils';

export default class Footer extends React.Component {

  renderLeftLinks() {
    return this.renderLinks([{
      href: '/guides.html',
      anchor: localizeString('FOOTER.HELP'),
      faClass: 'fa-question-circle'
    }]);
  }

  renderRightLinks() {
    return this.renderLinks([{
      href: `mailto:${Constants.SUPPORT_MAIL}`,
      anchor: Constants.SUPPORT_MAIL,
      faClass: 'fa-envelope'
    }]);
  }

  renderLinks(links) {
    return (
        <div className="b-footer-links">
          {links.map(link => this.renderLink(link))}
        </div>
    );
  }

  renderLink(link) {
    return (
        <div key={link.href} className="b-footer-links__link">
          <a className="b-footer-link" href={link.href}>
            <div className="b-footer-link__icon">
              <div className={`b-footer-link-icon fa ${link.faClass}`}/>
            </div>
            <div className="b-footer-link__anchor">
              <div className="b-footer-link-anchor">
                {link.anchor}
              </div>
            </div>
          </a>
        </div>
    );
  }

  render() {
    const copyrightLinkClassNames = classNames('b-footer-link', 'b-footer-link--copyright');
    return (
      <div className="b-footer">
        <div className="b-footer__items">
          <div className="b-footer-items">
            <div className="b-footer-items__item">
              {this.renderLeftLinks()}
            </div>
            <div className="b-footer-items__item">
              <a className={copyrightLinkClassNames} href={`/`}>4stream © 2017</a>
            </div>
            <div className="b-footer-items__item">
              {this.renderRightLinks()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
};

