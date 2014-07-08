window.angular.module('telemenu.menus')
    .controller('MenusController', [
        '$scope',
        '$routeParams',
        '$location',
        'Global',
        'Places',
        'Menus',
        'DateMinutesConversor',
        '$modal',
        '$log',
        function ($scope, $routeParams, $location, Global, Places, Menus, DateMinutesConversor, $modal, $log) {
            $scope.global = Global;
            $scope.submitted = false;
            $scope.newFood = '';
            $scope.newSection = '';
            $scope.menu = {};
            $scope.places = [];
            $scope.days = [
                {id: 'Monday', text: 'Lunes'},
                {id: 'Tuesday', text: 'Martes'},
                {id: 'Wednesday', text: 'Miércoles'},
                {id: 'Thursday', text: 'Jueves'},
                {id: 'Friday', text: 'Viernes'},
                {id: 'Saturday', text: 'Sábado'},
                {id: 'Sunday', text: 'Domingo'}
            ];
            $scope.invalid = {
                sections: true,
                food: true
            };

            var setMaxPrice = function (menus) {
                $scope.maxPrice = Number.MIN_VALUE;
                for (var i = 0; i < menus.length; i++) {
                    $scope.maxPrice = Math.max(menus[i].price, $scope.maxPrice);
                }
            };

            $scope.srcImage = function (path) {
                return path.slice(path.indexOf('/img/'));
            };

            $scope.menuFilter = function (menu) {
                if (menu.price > $scope.maxPrice) {
                    return false;
                }

                return true;
            };

            $scope.initMenu = function () {
                $scope.menu = {
                    sections: [],
                    available: [{
                        days: [],
                        hours: [{
                            from: new Date(),
                            to: new Date(new Date().setHours(new Date().getHours()+1))
                        }]
                    }]
                };
            };

            $scope.isMenuValid = function () {
                if ($scope.menu.sections && $scope.menu.sections.length > 0) {
                    $scope.invalid.sections = false;
                    $scope.invalid.food = false;
                    for (var i = 0; i < $scope.menu.sections.length; i++) {
                        if ($scope.menu.sections[i].foods.length < 1 ) {
                            $scope.invalid.food = true;
                            return false;
                        }
                    }
                } else {
                    $scope.invalid.sections = true;
                    return false;
                }

                return true;
            };

            $scope.$watch('menu.sections', $scope.isMenuValid, true);

            $scope.getPlaces = function () {
                Places.mine().success(function (data) {
                    $scope.places = data.places;
                }).error(function (data) {
                    console.log('Error:');
                    console.log(data);
                });
            };

            $scope.addSection = function ($event) {
                var newSection = $scope.newSection.trim();

                if (!newSection.length) {
                    return;
                }

                $scope.menu.sections.push({
                    name: newSection,
                    foods: []
                });
                $scope.newSection = '';
                $event.preventDefault();
            };

            $scope.addFood = function ($event, section) {
                var newFood = this.newFood.trim();

                if (!newFood.length) {
                    return;
                }

                section.foods.push(newFood);
                this.newFood = '';
                $event.preventDefault();
            };

            $scope.removeSection = function (section) {
                $scope.menu.sections.splice(
                    $scope.menu.sections.indexOf(section),
                    1
                );
            };

            $scope.editSection = function (section, newName) {
                if (newName) {
                    var indexSection = $scope.menu.sections.indexOf(section);
                    $scope.menu.sections[indexSection].name = newName;
                }
            };

            $scope.removeFood = function (section, food) {
                var array = $scope.menu.sections[$scope.menu.sections.indexOf(section)].foods;

                array.splice(
                    array.indexOf(food),
                    1
                );
            };

            $scope.editFood = function (section, food, newName) {
                if (newName) {
                    var foods = $scope.menu.sections[$scope.menu.sections.indexOf(section)].foods;
                    foods[foods.indexOf(food)] = newName;
                }
            };

            $scope.create = function(isValid) {
                $scope.submitted = true;

                if ($scope.isMenuValid() && isValid) {
                    var menu = new Menus(
                        $scope.menu
                    );

                    menu.available[0].hours[0].from = DateMinutesConversor.toMinutes(
                            $scope.menu.available[0].hours[0].from);
                    menu.available[0].hours[0].to = DateMinutesConversor.toMinutes(
                            $scope.menu.available[0].hours[0].to);

                    menu.$save(function (response) {
                        $location.path('menus/' + response._id);
                    });

                    $scope.initMenu();
                }
            };

            $scope.mine = function () {
                Menus.query({user: Global.user._id}, function (menus) {
                    $scope.menus = menus;
                });
            };

            $scope.find = function () {
                Menus.query({}, function (menus) {
                    $scope.menus = menus;
                    setMaxPrice(menus);
                });
            };

            $scope.update = function(isValid) {
                if ($scope.isMenuValid() && isValid) {
                    var menu = $scope.menu;
                    menu.available[0].hours[0].from = DateMinutesConversor.toMinutes(
                            $scope.menu.available[0].hours[0].from);
                    menu.available[0].hours[0].to = DateMinutesConversor.toMinutes(
                            $scope.menu.available[0].hours[0].to);

                    menu.$update(function () {
                        $location.path('menus/' + menu._id);
                    });
                }
            };

            $scope.findOne = function () {
                Menus.get({menuId: $routeParams.menuId}, function (menu) {
                    $scope.menu = menu;
                    $scope.menu.available[0].hours[0].from = DateMinutesConversor.toDate(
                            menu.available[0].hours[0].from);
                    $scope.menu.available[0].hours[0].to = DateMinutesConversor.toDate(
                            menu.available[0].hours[0].to);
                    $scope.place = menu.place;
                    $scope.menu.place = menu.place._id;
                    $scope.currentImage = $scope.srcImage($scope.place.image.original.path);
                    $scope.codeAddress($scope.place.address.str);
                });
            };

            $scope.destroy = function (menu) {
                menu.$remove();
                for (var i in $scope.menus) {
                    if ($scope.menus[i] === menu) {
                        $scope.menus.splice(i, 1);
                    }
                }
            };

            $scope.modalRemoveMenu = function (target, menu) {
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

                modalInstance.result.then(function () {
                    $scope.destroy(menu);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.modalRemoveSection = function (target, section) {

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

                modalInstance.result.then(function () {
                    $scope.removeSection(section);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.modalRemoveFood = function (target, section, food) {

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

                modalInstance.result.then(function () {
                    $scope.removeFood(section, food);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.modalEditFood = function (target, section, food) {

                var modalInstance = $modal.open({
                    templateUrl: 'views/bootstrap/edit-modal.html',
                    controller: function ($scope, $modalInstance, target) {
                        $scope.target = target;

                        $scope.ok = function () {
                            $modalInstance.close($scope.$$childTail.newName);
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

                modalInstance.result.then(function (newName) {
                    $scope.editFood(section, food, newName);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };


            $scope.modalEditSection = function (target, section) {

                var modalInstance = $modal.open({
                    templateUrl: 'views/bootstrap/edit-modal.html',
                    controller: function ($scope, $modalInstance, target) {
                        $scope.target = target;

                        $scope.ok = function () {
                            $modalInstance.close($scope.$$childTail.newName);
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

                modalInstance.result.then(function (newName) {
                    $scope.editSection(section, newName);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };


        }
    ]);

