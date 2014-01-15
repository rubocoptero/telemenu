global.appContainer.resolve(function (UserStore) {
    describe('<Integration Test>', function() {
        var user, user2;
        describe('Model User:', function() {
            before(function() {
                user = new UserStore({
                    name: 'Full name',
                    email: 'test@test.com',
                    username: 'user',
                    password: 'password'
                });
                user2 = new UserStore({
                    name: 'Full name',
                    email: 'test@test.com',
                    username: 'user',
                    password: 'password'
                });
            });

            describe('Method Save', function() {
                it('should begin with no users', function(done) {
                    UserStore.find({}, function(err, users) {
                        users.should.have.length(0);
                        done();
                    });
                });

                it('should be able to save without problems', function(done) {
                    user.save(done);
                });

                it('should fail to save an existing user again', function(done) {
                    user.save();
                    return user2.save(function(err) {
                        should.exist(err);
                        done();
                    });
                });

                it('should be able to show an error when try to save without name', function(done) {
                    user.name = '';
                    return user.save(function(err) {
                        should.exist(err);
                        done();
                    });
                });
            });

            after(function(done) {
                UserStore.remove().exec(done);
            });
        });
    });
});
