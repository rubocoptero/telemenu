global.appContainer.resolve(function (mongoose) {
    module.exports = function (userId) {
        var users = [
            {
                _id: userId,
                name: 'Pepe',
                email: 'pepe@test.com',
                username: 'pepe',
                password: 'pepesenya'
            },
            {
                _id: new mongoose.Types.ObjectId('52d7bcec6f022e051600000d'),
                name: 'Paco',
                email: 'paco@test.com',
                username: 'paco',
                password: 'pacosenya'
            },
        ];

        return {
            User: users
        };
    };
});
