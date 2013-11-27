window.angular.module('telemenu.menus', [])
    .controller('MenusController', [
        '$scope',
        '$routeParams',
        '$location',
        'Global',
        'Menus',
        function ($scope, $routeParams, $location, Global, Menus) {
            $scope.global = Global;

            $scope.create = function() {
                var menu = new Menus({
                    // TODO stuff
                });

                menu.$save(function (response) {
                    $location.path('menus/' + response._id);
                });

                // Clear form HERE!
            };
        }
    ]);

