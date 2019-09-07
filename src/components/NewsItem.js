import React from 'react';
import {Link} from 'react-router';

import {formatDateTime} from '../utils/DateUtils';
import {localizeString} from '../localization/LocalizationUtils';
import {matchLink, matchImage, matchYoutubeVideo} from '../utils/NewsUtils';

export default class NewsItem extends React.Component {

  render() {
    const {item, timeZone} = this.props;
    const title = !(item.title) ? localizeString('DASHBOARD_NEWS.NO_TITLE') : item.title;
    const contentWrapper = {content: item.content};
    const imageName = matchImage(contentWrapper);
    const linkUrl = matchLink(contentWrapper);
    const youtubeUrl = matchYoutubeVideo(contentWrapper);
    const image = (imageName === null) ? null : (
      <div className="b-dashboard-news-item-image-wrapper">
        <div className="b-dashboard-news-item-image-wrapper__image">
          <img className="b-dashboard-news-item-image" src={`/resources/images/news/${imageName}`}/>
        </div>
      </div>
    );
    const link = (linkUrl === null) ? null : (
        <div className="b-dashboard-news-item__link">
          <Link className="b-dashboard-news-item-link" to={linkUrl}>
            <div className="b-dashboard-news-item-link__icon fa fa-link"/>
            {localizeString('NEWS_ITEM.TRY')}
          </Link>
        </div>
    );
    const youtube = (youtubeUrl === null) ? null : (
        <div className="b-dashboard-news-item__youtube">
          <div className="b-dashboard-news-item-youtube">
            <iframe width="600" height="400" src={youtubeUrl} frameBorder="0" allowFullScreen/>
          </div>
        </div>
    );
    const contentParts = contentWrapper.content.split('<br>').map((part, index) =>
        <div key={`part_${index}`} className="b-dashboard-news-item-content__part">{part}</div>
    );
    return (
        <div className="b-dashboard-news-item">
          <div className="b-dashboard-news-item__title">
            <div className="b-dashboard-news-item-title">{title}</div>
          </div>
          <div className="b-dashboard-news-item__timestamp">
            <div className="b-dashboard-news-item-timestamp">
              <i className="fa fa-calendar">&nbsp;</i>
              {formatDateTime(item.timestamp, timeZone)}
            </div>
          </div>
          <div className="b-dashboard-news-item__content">
            <div className="b-dashboard-news-item-content">{contentParts}</div>
            {link}
            {image}
            {youtube}
          </div>
        </div>
    );
  }
}

NewsItem.propTypes = {
  item: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    content: React.PropTypes.string.isRequired,
    timestamp: React.PropTypes.number.isRequired
  }).isRequired,
  timeZone: React.PropTypes.string
};

