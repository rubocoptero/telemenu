global.appContainer.resolve(function (fixturesLoader, mongoose, UserStore, imageFixture) {
    var userId = new mongoose.Types.ObjectId(),
        placeId = new mongoose.Types.ObjectId(),
        fixtureUsers = require('./users')(userId),
        fixturePlaces = require('./places')(userId, placeId);



    var loadUsers = function (cb) {
        fixturesLoader.load(fixtureUsers, mongoose.connection, cb);
    };

    var loadPlaces = function (cb) {
        fixturesLoader.load(fixtureUsers, mongoose.connection,
            fixturesLoader.load(fixturePlaces,
                mongoose.connection, cb));
    };

    var getLoginUser = function (cb) {
        loadUsers(function(err) {
            if (err) return cb(err);
            UserStore.findOne({_id: userId}, cb);
        });
    };

    module.exports = {
        loadUsers: loadUsers,
        loadPlaces: loadPlaces,
        getUserId: function () { return userId; },
        getPlaceId: function () { return placeId; },
        getLoginUser: getLoginUser,
        getPlaceImage: imageFixture.getPath
    };
});
