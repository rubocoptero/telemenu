global.appContainer.resolve(function () {
    module.exports = function (userId, placeId) {
        var places = [
            {
                _id: placeId,
                user: userId,
                name: 'The Awesome Place',
                address: {
                    str: '6 Awesome St.',
                    lat: 40.46366700000001,
                    lng: -3.7492200000000366
                },
                description: 'Yeah! it is awesome',
                telephone: '666666666',
                reservations_constrains: {
                    capacity: 1,
                    minutes_per_customer: 60
                }
            }
        ];

        return {
            Place: places
        };
    };
});
