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
    'telemenu.maps',
    'angularFileUpload',
    'checklist-model'
]);

window.angular.module('telemenu.system', []);
window.angular.module('telemenu.articles', []);
window.angular.module('telemenu.places', []);
window.angular.module('telemenu.menus', []);
window.angular.module('telemenu.maps', []);
