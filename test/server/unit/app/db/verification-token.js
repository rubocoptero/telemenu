global.appContainer.resolve(function (mongoose, VerificationTokenStore, UserStore, mailer, consoleUtil) {
    describe('<Integration Test>', function() {
        var verificationToken;

        describe('Model VerificationToken:', function() {
            beforeEach(function() {
                verificationToken = new VerificationTokenStore({
                    user: mongoose.Types.ObjectId()
                });
            });

            afterEach(function(done) {
                verificationToken = null;
                VerificationTokenStore.remove({}).exec(done);
            });

            it('should begin with no tokens', function(done) {
                VerificationTokenStore.find({}, function(err, tokens) {
                    tokens.should.have.length(0);
                    done();
                });
            });

            it('should generate a new token when save', function(done) {
                verificationToken.save(function(err, savedToken) {
                    should.not.exist(err);
                    should.exist(savedToken.token);
                    done();
                });
            });

            it('should throw an error when the token already exists', function(done) {
                var anotherVerificationToken = new VerificationTokenStore({
                    user: mongoose.Types.ObjectId()
                });


                verificationToken.save(function(err, firstSaved) {
                    anotherVerificationToken.token = firstSaved.token;
                    verificationToken.token.should.be.equal(anotherVerificationToken.token);
                    anotherVerificationToken.save(function(err) {
                        should.exist(err);
                        err.code.should.be.equal(11000);
                        done();
                    });
                });
            });

            it('should create another token even though the user already exists', function(done) {
                var anotherVerificationToken = new VerificationTokenStore({
                    user: verificationToken.user
                });
                verificationToken.user.should.equal(anotherVerificationToken.user);

                verificationToken.save(function() {
                    anotherVerificationToken.save(function(err) {
                        should.not.exist(err);
                        VerificationTokenStore.find({}, function(err, tokens) {
                            tokens.should.have.length(2);
                            done();
                        });
                    });
                });
            });
        });
        describe('Getting user from a token:', function() {
            var user;

            beforeEach(function(done) {
                user = new UserStore({
                    name: 'Full name',
                    email: 'test@test.com',
                    username: 'user',
                    password: 'password'
                });
                user.save(function(err, userSaved) {
                    verificationToken = new VerificationTokenStore({
                        user: userSaved._id
                    });
                    verificationToken.save(done);
                });
            });

            afterEach(function(done) {
                verificationToken = null;
                user = null;
                VerificationTokenStore.remove({}).exec(function() {
                    UserStore.remove({}).exec(done);
                });
            });

            it('should populate user properly', function(done) {
                VerificationTokenStore.populatedFindByToken(verificationToken.token,
                    function(err, tokenPopulated) {
                        tokenPopulated.user.username.should.be.equal(user.username);
                        done();
                    });
            });

            it('should get a null result when token is not store',
                function(done) {
                    VerificationTokenStore.populatedFindByToken('doesNotExist',
                        function(err, resultUser) {
                            should.not.exist(err);
                            should.not.exist(resultUser);
                            done();
                        });
                });

            it('should get a null result when the user of token does not exist',
                function(done) {
                    user.remove(function() {
                        VerificationTokenStore.populatedFindByToken(
                            verificationToken.token,
                            function(err, resultUser) {
                                should.not.exist(err);
                                should.not.exist(resultUser.user);
                                done();
                            });
                    });
                });

            it('should get user by token', function(done) {
                VerificationTokenStore.getUserByToken(verificationToken.token,
                    function(err, resultUser) {
                        resultUser.username.should.be.equal(user.username);
                        done();
                    });
            });

            it('should get a null result when search user by a token which does not exist', function(done) {
                VerificationTokenStore.getUserByToken('doesNotExist',
                    function(err, resultUser) {
                        should.not.exist(err);
                        should.not.exist(resultUser);
                        done();
                    });
            });

            it('should get a null result when there is not user by the given token', function(done) {
                user.remove(function() {
                    VerificationTokenStore.getUserByToken(verificationToken.token,
                        function(err, resultUser) {
                            should.not.exist(err);
                            should.not.exist(resultUser);
                            done();
                        });
                });
            });
        });

        describe('Creating a token from user:', function() {
            var user;
            var mailerStub;

            beforeEach(function(done) {
                mailerStub = sinon.stub(mailer, 'sendVerificationLink',
                    function(email, link, cb) {
                        cb();
                    });
                user = new UserStore({
                    name: 'Full name',
                    email: 'test@test.com',
                    username: 'user',
                    password: 'password'
                });
                user.save(function() {
                    done();
                });
            });

            afterEach(function(done) {
                verificationToken = null;
                user = null;
                mailerStub.restore();
                VerificationTokenStore.remove({}).exec(function() {
                    UserStore.remove({}).exec(done);
                });
            });

            it('should return an error when _id is undefined',
                function(done) {
                    consoleUtil.logMocked(function() {
                        user._id = undefined;
                        VerificationTokenStore.createFor(user, function(err, createdToken) {
                            should.exist(err);
                            err.message.should.have.string('Validation failed');
                            done();
                        });
                    });
                });

            it('should create a token with the same user id which was received',
                function(done) {
                    consoleUtil.logMocked(function() {
                        VerificationTokenStore.createFor(user,
                            function(err, createdToken) {
                                should.not.exist(err);
                                createdToken.user.should.be.equal(user._id);
                                done();
                            });
                    });
                });

            it('should get the verification link', function(done) {
                consoleUtil.logMocked(function() {
                    VerificationTokenStore.createFor(user, function(err, createdToken) {
                        var verificationLink = createdToken.link;

                        verificationLink.should.have.string('http');
                        verificationLink.should.have.string(
                            '/verificacion/' + createdToken.token
                        );
                        done();
                    });
                });
            });

            it('should send a email to user with the created token', function(done) {
                consoleUtil.logMocked(function() {
                    VerificationTokenStore.createFor(user, function(err, createdToken) {
                        should.not.exist(err);
                        mailerStub.should.be.calledOnce;
                        mailerStub.should.be.calledWith(user.email, createdToken.link);
                        done();
                    });
                });
            });
        });
    });
});

