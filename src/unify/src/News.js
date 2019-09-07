/*global $*/
import {formatDateTime} from './DateUtils';
import {matchLink, matchImage, matchYoutubeVideo} from '../../utils/NewsUtils';
import {localizeString} from '../../localization/LocalizationUtils';

function renderNews(newsBlog, news) {
  $('.page-loader').remove();
  news.forEach((newsItem, index) => {
    const title = newsItem.title ? newsItem.title : localizeString('DASHBOARD_NEWS.NO_TITLE');
    const contentWrapper = {content: newsItem.content};
    const link = matchLink(contentWrapper);
    const image = matchImage(contentWrapper);
    const video = matchYoutubeVideo(contentWrapper);
    const tryLabel = localizeString('NEWS_ITEM.TRY');
    const linkElement = !link ? '' : (
        `<p><a class="btn btn-u btn-u-blue rounded btn-u-small" href="${link}"><i class="fa fa-plus"></i> ${tryLabel}</a></p>`
    );
    const imageElement = !image ? '' : (
        `
            <div class="blog-img">
					      <img class="img-responsive img-bordered" src="/resources/images/news/${image}" alt="">
				    </div>
        `
    );
    const videoElement = !video ? '' : (
        `
            <div class="blog-img">
                <div class="embed-responsive embed-responsive-16by9">
                    <iframe src="${video}" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
                </div>
            </div>
        `
    );
    newsBlog.append(`
			<div class="blog margin-bottom-40">
			  <div id="newsItem${index}" class="news-link"></div>
				<h2>${title}</h2>
				<div class="blog-post-tags">
					<ul class="list-unstyled list-inline blog-info">
						<li><i class="fa fa-calendar"></i> ${formatDateTime(newsItem.timestamp)}</li>
					</ul>
				</div>
				<p>${contentWrapper.content}</p>
				${videoElement}
				${imageElement}
				${linkElement}
			</div>
      `
    );
  });
  const fragment = window.location.hash;
  if (fragment) {
    $('html, body').animate({
      scrollTop: $(`${fragment}`).offset().top
    }, 1000);
  }
  $('.footer-wrapper').show();
}

export {renderNews};
