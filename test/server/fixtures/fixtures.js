global.appContainer.resolve(function (fixturesLoader, mongoose, UserStore, imageFixture) {
    var userId = new mongoose.Types.ObjectId(),
        placeId = new mongoose.Types.ObjectId(),
        menuId = new mongoose.Types.ObjectId(),
        fixtureUsers = require('./users')(userId),
        fixturePlaces = require('./places')(userId, placeId),
        fixtureMenus = require('./menus')(userId, placeId, menuId);

    var loader = function (fixtures, cb) {
        fixturesLoader.load(
            fixtures,
            mongoose.connection,
            cb
        );
    };

    var loadUsers = function (cb) {
        loader(fixtureUsers, cb);
    };

    var loadPlaces = function (cb) {
        loader(fixtureUsers,
            loader(fixturePlaces, cb));
    };

    var loadMenus = function (cb) {
        loader(fixtureUsers,
            loader(fixturePlaces,
                loader(fixtureMenus, cb)));
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
        loadMenus: loadMenus,
        getUserId: function () { return userId; },
        getPlaceId: function () { return placeId; },
        getMenuId: function() { return menuId; },
        getLoginUser: getLoginUser,
        getPlaceImage: imageFixture.getPath,
        getPlaceData: function() { return fixturePlaces.Place[0]; }
    };
});
