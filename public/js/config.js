//Setting up route
window.app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'views/index.html'
        })
        .when('/menus',
        {
            templateUrl: 'views/menus/list.html'
        })
        .when('/menus/buscar',
        {
            templateUrl: 'views/menus/search.html'
        })
        .when('/menus/crear',
        {
            templateUrl: 'views/menus/create.html'
        })
        .when('/menus/:menuId/editar',
        {
            templateUrl: 'views/menus/edit.html'
        })
        .when('/menus/:menuId',
        {
            templateUrl: 'views/menus/view.html'
        })
        .when('/localizaciones', {
            templateUrl: 'views/localizaciones/list.html'
        })
        .when('/localizaciones/crear', {
            templateUrl: 'views/localizaciones/create.html'
        })
        .when('/localizaciones/:placeId/editar', {
            templateUrl: 'views/localizaciones/edit.html'
        }).
        when('/localizaciones/:placeId', {
            templateUrl: 'views/localizaciones/view.html'
        })
        .otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
window.app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);
