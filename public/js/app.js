window.app = angular.module('telemenu', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'ui.route',
    'ui.keypress',
    'ui.validate',
    'telemenu.system',
    'telemenu.articles',
    'telemenu.menus',
    'telemenu.places',
    'telemenu.maps',
    'angularFileUpload',
    'checklist-model',
    'xeditable'
]);

window.angular.module('telemenu.system', []);
window.angular.module('telemenu.articles', []);
window.angular.module('telemenu.places', []);
window.angular.module('telemenu.menus', []);
window.angular.module('telemenu.maps', []);

window.app.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
