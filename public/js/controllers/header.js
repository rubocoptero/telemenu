angular.module('telemenu.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [/*{
        "title": "Articles",
        "link": "articles"
    }, {
        "title": "Create New Article",
        "link": "articles/create"
    }, {
        "title": "Crear nuevo Menú",
        "link": "menus/create"
    }*/];

    $scope.isCollapsed = false;
}]);
