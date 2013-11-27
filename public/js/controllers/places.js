window.angular.module('telemenu.places', [])
    .controller('PlacesController', [
        '$scope',
        '$routeParams',
        '$location',
        'Global',
        function ($scope, $routeParams, $location, Global, Menus) {
            $scope.global = Global;
            var initializePlace = function() {
                return {
                    address: {},
                    reservations_constrains: {
                        opening_hours: [{
                            days: [],
                            hours: [{}]
                        }]
                    }
                };
            };
            $scope.place = initializePlace();


            $scope.create = function() {
                alert("Creado!");
            };


        }
    ]);

