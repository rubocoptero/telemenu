window.angular.module('telemenu.places')
    .controller('PlacesController', [
        '$scope',
        '$routeParams',
        '$location',
        'Global',
        'Places',
        '$modal',
        function ($scope, $routeParams, $location, Global, Places, $modal) {
            $scope.global = Global;
            $scope.image = null;

            var srcImage = function (path) {
                return path.slice(path.indexOf('/img/'));
            };

            var setLatLng = function () {
                if ($scope.marker) {
                    $scope.place.address.lat = $scope.marker.position.d;
                    $scope.place.address.lng = $scope.marker.position.e;
                } else {
                    console.log('Error: marker is undefined');
                }
            };

            $scope.initPlace = function () {
                $scope.place = {
                    address: {},
                    reservations_constrains: {
                        capacity: 1,
                        minutes_per_customer: 60
                    }
                };
            };

            $scope.onFileSelect = function ($files) {
                if ($files[0]) {
                    $scope.image = $files[0];
                }
            };

            $scope.create = function() {
                setLatLng();
                Places.create(
                    $scope.place,
                    $scope.image
                ).success(function (data) {
                    $location.path('localizaciones');
                }).error(function (data) {
                    console.log('Error:');
                    console.log(data);
                });
            };

            $scope.mine = function() {
                Places.mine().success(function (data) {
                    $scope.places = data.places;
                }).error(function (data) {
                    console.log('Error:');
                    console.log(data);
                });
            };

            $scope.update = function() {
                setLatLng();
                Places.update(
                    $routeParams.placeId,
                    $scope.place,
                    $scope.image
                ).success(function (data) {
                    $location.path('localizaciones');
                }).error(function (data) {
                    console.log('Error:');
                    console.log(data);
                });
            };

            $scope.findOne = function () {
                Places.findOne(
                    $routeParams.placeId
                ).success(function (data) {
                    $scope.place = data;
                    $scope.currentImage = srcImage(data.image.original.path);
                    $scope.codeAddress(data.address.str);
                }).error(function (data) {
                    console.log('Error:');
                    console.log(data);
                });
            };

            $scope.remove = function (id) {
                Places.remove(
                    id
                ).success(function (data) {
                    $scope.mine();
                }).error(function (data) {
                    console.log('Error:');
                    console.log(data);
                });
            };
        }
    ]);

