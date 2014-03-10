window.angular.module('telemenu.menus')
    .factory('Menus', ['$resource',
        function($resource) {
            return $resource(
                'menus/:menuId',
                {
                    menuId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }]);
