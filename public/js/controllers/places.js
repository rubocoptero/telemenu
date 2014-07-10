window.angular.module('telemenu.places')
    .controller('PlacesController', [
        '$scope',
        '$routeParams',
        '$location',
        'Global',
        'Places',
        '$modal',
        '$log',
        function ($scope, $routeParams, $location, Global, Places, $modal, $log) {
            $scope.global = Global;
            $scope.image = null;
            $scope.uploading = false;

            var srcImage = function (path) {
                return path.slice(path.indexOf('/img/'));
            };

            var setLatLng = function () {
                if ($scope.marker) {
                    $scope.place.address.lat = $scope.marker.position.A;
                    $scope.place.address.lng = $scope.marker.position.k;
                } else {
                    console.log('Error: marker is undefined');
                }
            };

            var isValid = function () {
                return $scope.placeForm.$valid && $scope.image;
            };

            $scope.getAddress = function ($event) {
                $scope.codeAddress();
                $event.preventDefault();
            }

            $scope.initPlace = function () {
                $scope.place = {
                    address: {
                        lat: 0,
                        lng: 0
                    },
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
                $scope.submitted = true;
                if (isValid()) {
                    //setLatLng();
                    $scope.uploading = true;
                    Places.create(
                        $scope.place,
                        $scope.image
                    ).success(function (data) {
                        $location.path('localizaciones');
                    }).error(function (data) {
                        console.log('Error:');
                        console.log(data);
                        $scope.uploading = false;
                    });
                }
                $scope.uploading = false;
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
                $scope.submitted = true;
                if (isValid()) {
                    //setLatLng();
                    $scope.uploading = true;
                    Places.update(
                        $routeParams.placeId,
                        $scope.place,
                        $scope.image
                    ).success(function (data) {
                        $location.path('localizaciones');
                    }).error(function (data) {
                        $scope.uploading = false;
                        console.log('Error:');
                        console.log(data);
                    });
                }
                $scope.uploading = false;
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

            $scope.modalRemove = function (target, id) {

                var modalInstance = $modal.open({
                    templateUrl: 'views/bootstrap/remove-modal.html',
                    controller: function ($scope, $modalInstance, target) {

                        $scope.target = target;

                        $scope.ok = function () {
                            $modalInstance.close(true);
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {
                        target: function () {
                            return target;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.remove(id);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        }
    ]);

