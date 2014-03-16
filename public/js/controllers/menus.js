window.angular.module('telemenu.menus')
    .controller('MenusController', [
        '$scope',
        '$routeParams',
        '$location',
        'Global',
        'Places',
        'Menus',
        'DateMinutesConversor',
        function ($scope, $routeParams, $location, Global, Places, Menus, DateMinutesConversor) {
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

            $scope.removeFood = function (section, food) {
                var array = $scope.menu.sections[$scope.menu.sections.indexOf(section)].foods;

                array.splice(
                    array.indexOf(food),
                    1
                );
            };

            $scope.create = function(isValid) {
                console.log($scope.menu);
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
                        $location.path('');
                    });

                    $scope.initMenu();
                }
            };
        }
    ]);

