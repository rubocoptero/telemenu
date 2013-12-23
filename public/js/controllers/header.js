angular.module('telemenu.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [
        {
            'title': 'Crear nuevo Menú',
            'link': 'menus/create',
            'access': 'global.verified'
        }/*,
        {
            'title': 'Articles',
            'link': 'articles'
        }, {
            'title': 'Create New Article',
            'link': 'articles/create'
        }*/
    ];

    $scope.isCollapsed = false;
}]);
