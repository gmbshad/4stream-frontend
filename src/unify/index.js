// CSS Global Compulsory
import './assets/plugins/bootstrap/css/bootstrap.css';
import './assets/css/style.css';
// CSS Header and Footer 
import './assets/css/headers/header-v6.css';
import './assets/css/footers/footer-v1.css';
// CSS Implementing Plugins
import './assets/plugins/font-awesome/css/font-awesome.css';
import './assets/plugins/fancybox/source/jquery.fancybox.css';
import './assets/plugins/owl-carousel/owl-carousel/owl.carousel.css';
// CSS Theme 
import './assets/css/theme-colors/blue.css';
import './assets/css/theme-skins/dark.css';
// CSS Page Style -->
import './assets/css/pages/blog.css';
// CSS Customization
import './assets/css/custom.css';

// Babel polyfill
import 'babel-polyfill';
// JS Global Compulsory
import './assets/plugins/jquery/jquery-migrate.js';
import './assets/plugins/bootstrap/js/bootstrap.js';
import './assets/plugins/bootstrap-notify/bootstrap-notify.js';
// JS Implementing Plugins
import './assets/plugins/back-to-top.js';
import './assets/plugins/fancybox/source/jquery.fancybox.pack.js';
import './assets/plugins/owl-carousel/owl-carousel/owl.carousel.js';
// JS Customization
import './assets/js/custom.js';
// JS Page Level
import App from './assets/js/app.js';
import FancyBox from './assets/js/plugins/fancy-box.js';
import OwlCarousel from './assets/js/plugins/owl-carousel.js';

import {onDOMContentLoaded} from './src/Initializer';

document.addEventListener('DOMContentLoaded', function() {
  App.init();
  FancyBox.initFancybox();
  OwlCarousel.initOwlCarousel();
  onDOMContentLoaded();
}, false);
