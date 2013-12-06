window.app = angular.module('telemenu', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'ui.route',
    'telemenu.system',
    'telemenu.articles',
    'telemenu.menus',
    'telemenu.places',
    'telemenu.maps'
]);

angular.module('telemenu.system', []);
angular.module('telemenu.articles', []);
angular.module('telemenu.menus', []);
angular.module('telemenu.maps', []);
angular.module('telemenu.places', []);
