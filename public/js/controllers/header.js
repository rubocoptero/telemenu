angular.module('telemenu.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [
        {
            'title': 'Buscar menús',
            'link': 'menus/buscar',
            'access': true
        },
        {
            'title': 'Mis menús',
            'link': 'menus',
            'access': 'global.verified'
        },
        {
            'title': 'Crear nuevo Menú',
            'link': 'menus/crear',
            'access': 'global.verified'
        }
    ];

    $scope.isCollapsed = false;
}]);
