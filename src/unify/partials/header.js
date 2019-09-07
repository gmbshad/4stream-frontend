import {localizeString} from '../../localization/LocalizationUtils';

function render() {
  return `
        <!--=== Header v6 ===-->
        <div class="header-v6 header-sticky">
            <!-- Navbar -->
            <div class="navbar mega-menu" role="navigation">
                <div class="container">
                    <!-- Brand and toggle get grouped for better mobile display -->
                    <div class="menu-container">
                        <!-- Navbar Brand -->
                        <div class="navbar-brand">
                            <a href="/">
                                <img class="default-logo" src="/resources/images/logo-white.png" alt="Logo">
                                <img class="shrink-logo" src="/resources/images/logo-black.png" alt="Logo">
                            </a>
                        </div>
                        <!-- ENd Navbar Brand -->
        
                        <!-- Header Inner Right -->
                        <div class="header-inner-right">
                            <div class="log-reg-block-simple cd-log_reg">
                                <a class="btn btn-u cd-signin login-button rounded disabled" href="javascript:void(0);">
                                    <i class="fa fa-twitch"></i>
                                    ${localizeString('HEADER.LOGIN')}
                                </a>
                            </div>
                        </div>
                        <!-- End Header Inner Right -->
                    </div>
                </div>
            </div>
            <!-- End Navbar -->
        </div>
        <!--=== End Header v6 ===-->
    `;
}

export {render};
