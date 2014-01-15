global.appContainer.resolve(function (UserStore) {
    var TestUser = function() {
        var userData = {
            name: 'Full name',
            email: 'test@test.com',
            username: 'user',
            password: 'password'
        };

        var normal = function() {
            return new UserStore(userData);
        };

        var saved = function(cb) {
            return new UserStore(userData).save(cb);
        };

        return {
            normal: normal,
            saved: saved
        };
    };

    var testUser = new TestUser();

    module.exports = testUser;
});
