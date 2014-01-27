global.appContainer.resolve(function (VerificationTokenStore, UserStore, dbTestUtil, mailer, consoleUtil, passportStub) {
    describe('<Integration Test>', function() {
        describe('Routing:', function() {
            dbTestUtil();
            var userData;
            beforeEach(function() {
                userData = {
                    name: 'Full name',
                    email: 'test@test.com',
                    username: 'user',
                    password: 'password'
                };
            });

            it('POST /users/ should create a new user, new token and send a mail', function(done) {
                this.timeout(6000);
                var sendVerificationSpy = sinon.spy(mailer, 'sendVerificationLink');

                consoleUtil.logMocked(function() {
                    request(app)
                        .post('/users/')
                        .send(userData)
                        .expect(200)
                        .end(function(err, res) {
                            sendVerificationSpy.should.have.been.calledOnce;
                            sendVerificationSpy.restore();
                            UserStore.find({}, function(err, users) {
                                users.should.have.length(1);
                                VerificationTokenStore.find({}, function(err, tokens) {
                                    tokens.should.have.length(1);
                                    done();
                                });
                            });
                        });
                });

            });

            it('GET /verificacion/<token> should validate an user', function(done) {
                this.timeout(6000);
                var user = new UserStore(userData);

                user.provider = 'local';
                user.save(function(err) {
                    should.not.exist(err);
                    VerificationTokenStore.createFor(user, function(err, createdToken) {
                        should.not.exist(err);
                        token = createdToken.token;

                        user.verified.should.be.false;

                        request(app)
                            .get('/verificacion/' + token)
                            .expect(200)
                            .end(function(err, res) {
                                UserStore.findById(user._id, function(err, retrievedUser) {
                                    retrievedUser.verified.should.be.true;
                                    done();
                                });
                            });
                    });
                });
            });

        //     it('GET /verificacion/reenviar should resend a new token to the user mail address', function(done) {
        //         var sendVerificationSpy = sinon.spy(mailer, 'sendVerificationLink');
        //         UserStore.create(userData, function(err, user) {
        //             should.not.exist(err);
        //             passportStub.install(app);
        //             passportStub.login('user');
        //             request(app)
        //                 .get('/verificacion/reenviar')
        //                 .expect(200)
        //                 .end(function(err, res) {
        //                     console.log(err);
        //                     console.log(res);
        //                     sendVerificationSpy.should.have.been.calledOnce;
        //                     sendVerificationSpy.restore();
        //                     VerificationTokenStore.find({}, function(err,tokens) {
        //                             tokens.should.have.length(1);
        //                             passportStub.uninstall(app);
        //                             done();
        //                         });
        //                 });
        //         });
        //     });
        });
    });
});
