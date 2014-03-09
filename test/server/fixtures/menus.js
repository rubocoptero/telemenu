global.appContainer.resolve(function () {
    module.exports = function (userId, placeId, menuId) {
        var menus = [
            {
                _id: menuId,
                user: userId,
                place: placeId,
                price: 10.50,
                sections: [
                    {
                        name: 'Main dish',
                        foods: [
                            'Meat',
                            'Fish'
                        ]
                    },
                    {
                        name: 'Dessert',
                        foods: [
                            'Fruit',
                            'Cake'
                        ]
                    }
                ],
                available: [{
                    days: ['Sat', 'Sun'],
                    hours: [{
                        from: 720,
                        to: 940
                    }]
                }]
            }
        ];

        return {
            Menu: menus
        };
    };
});
