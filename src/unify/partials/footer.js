import {localizeString} from '../../localization/LocalizationUtils';
import Constants from '../../utils/Constants';

function render() {
  const landing = localizeString('FOOTER.LANDING');
  const news = localizeString('FOOTER.NEWS');
  const guides = localizeString('FOOTER.GUIDES');
  const tar = localizeString('FOOTER.TARIFFS');
  const contacts = localizeString('FOOTER.CONTACTS');
  const vkGroup = localizeString('FOOTER.VK_GROUP');
  const twitterAccount = localizeString('FOOTER.TWITTER_ACCOUNT');
  return `
    <div class="footer-v1">
        <div class="footer sa-footer">
            <div class="container">
                <div class="row">
                    <!-- Link List -->
                    <div class="col-md-4 md-margin-bottom-40">
                        <div class="headline"><h2>${localizeString('FOOTER.USEFUL_LINKS')}</h2></div>
                        <ul class="list-unstyled link-list">
                            <li><a href="/">${landing}</a><i class="fa fa-angle-right"></i></li>
                            <li><a href="/news.html">${news}</a><i class="fa fa-angle-right"></i></li>
                            <li><a href="/tariffs.html">${tar}</a><i class="fa fa-angle-right"></i></li>
                            <li><a href="/guides.html">${guides}</a><i class="fa fa-angle-right"></i></li>
                        </ul>
                    </div>
                    <!-- End Link List -->
    
                    <!-- Latest -->
                    <div class="col-md-4 md-margin-bottom-40">
                        <div class="posts">
                            <div class="headline"><h2>${news}</h2></div>
                            <ul class="latest-news-list list-unstyled latest-list">
                            </ul>
                        </div>
                    </div><!--/col-md-3-->
                    <!-- End Latest -->
    
                    <!-- Address -->
                    <div class="col-md-4 map-img md-margin-bottom-40">
                        <div class="headline"><h2>${contacts}</h2></div>
                        <address class="md-margin-bottom-40">
                            Email: <a href="mailto:${Constants.SUPPORT_MAIL}" class="">${Constants.SUPPORT_MAIL}</a></br>
                            VK: <a href="${Constants.VK_GROUP_LINK}" class="">${vkGroup}</a></br>
                            Twitter: <a href="${Constants.TWITTER_LINK}" class="">${twitterAccount}</a></br></br>
                        </address>
                    </div>
                </div>
            </div>
        </div><!--/footer-->
    
        <div class="copyright">
            <div class="container">
                <div class="row">
                    <div class="col-md-4">
                        <div class="webmoney-links">
                            <a href="https://passport.webmoney.ru/asp/certview.asp?wmid=${Constants.STREAM_ASSIST_WEB_MONEY_ID}" target="_blank">
                                <img class="webmoney-link" src="/resources/images/webmoney_verified.png"/>
                            </a>
                        </div>
                    </div>
    
                    <div class="col-md-4">
                        <p>
                            4stream &copy; 2016
                        </p>
                    </div>
    
                    <!-- Social Links -->
                    <div class="col-md-4">
                        <ul class="footer-socials list-inline">
                            <li>
                                <a href="https://vk.com/4streamgroup" class="tooltips" data-toggle="tooltip" data-placement="top" title="" data-original-title="VK">
                                    <i class="fa fa-vk"></i>
                                </a>
                            </li>
                            <li>
                                <a href="https://twitter.com/_4stream" class="tooltips" data-toggle="tooltip" data-placement="top" title="" data-original-title="Twitter">
                                    <i class="fa fa-twitter"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <!-- End Social Links -->
                </div>
            </div>
        </div><!--/copyright-->
    </div>
  `;
}

export {render};

