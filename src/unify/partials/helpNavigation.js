import {localizeString} from '../../localization/LocalizationUtils';

function render() {
  return `
    <div class="col-md-2">
      <ul class="list-group sidebar-nav-v1">
          <li class="list-group-item"><a href="tariffs.html">${localizeString('HELP_PAGE_NAVIGATION.ABOUT_SERVICE.TARIFFS')}</a></li>
          <li class="list-group-item"><a href="guides.html">${localizeString('HELP_PAGE_NAVIGATION.HOWTO.TITLE')}</a></li>
      </ul>
  </div>
  `;
}

export {render};
