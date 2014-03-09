window.angular.module('telemenu.menus', [])
    .controller('MenusController', [
        '$scope',
        '$routeParams',
        '$location',
        'Global',
        'Places',
        function ($scope, $routeParams, $location, Global, Places) {
            $scope.global = Global;
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

            $scope.addSection = function () {
                var newSection = $scope.newSection.trim();

                if (!newSection.length) {
                    return;
                }

                $scope.menu.sections.push({
                    name: newSection,
                    foods: []
                });
                $scope.newSection = '';
            };

            $scope.addFood = function (section) {
                var newFood = this.newFood.trim();

                if (!newFood.length) {
                    return;
                }

                section.foods.push(newFood);
                this.newFood = '';
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

            $scope.create = function() {
                console.log($scope.menu);
                // var menu = new Menus({
                //     // TODO stuff
                // });

                // menu.$save(function (response) {
                //     $location.path('menus/' + response._id);
                // });

                // Clear form HERE!
            };
        }
    ]);

