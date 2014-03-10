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

            $scope.initMenu = function () {
                $scope.menu = {
                    sections: [],
                    available: [{
                        days: [],
                        hours: [{
                            from: new Date(),
                            to: new Date()
                        }]
                    }]
                };
            };

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
                $scope.sections.splice(
                    $scope.sections.indexOf(section),
                    1
                );
            };

            $scope.removeFood = function (section, food) {
                var array = $scope.sections[$scope.sections.indexOf(section)].foods;

                array.splice(
                    array.indexOf(food),
                    1
                );
            };

            $scope.create = function(isValid) {
                console.log($scope.menu);
                $scope.submitted = true;

                if (isValid) {
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

