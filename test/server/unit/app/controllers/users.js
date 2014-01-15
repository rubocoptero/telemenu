global.appContainer.resolve(
    function (
        UserStore,
        VerificationTokenStore,
        usersController,
        mailer
    ) {
        describe('<Integration Test>', function() {
            describe('Controller Users:', function() {
                afterEach(function(done) {
                    VerificationTokenStore.remove().exec(function() {
                        UserStore.remove().exec(done);
                    });
                });

                it('should send a error message when the user already exists',
                    function(done) {
                        var user = {
                            name: 'Full name',
                            email: 'test@test.com',
                            username: 'user',
                            password: 'password'
                        };
                        var req = {
                            body: user
                        };
                        var res = {
                            render: function(url, params) {
                                params.message.should.have.string('ya existe');
                                done();
                            }
                        };
                        new UserStore(user).save(function(err) {
                            usersController.create(req, res);
                        });
                    });

                it('should send a token when an user has been created',
                    function(done) {
                        var sendVerificationLinkStub = sinon.stub(mailer, 'sendVerificationLink', function() {
                                /* jshint expr: true */
                                sendVerificationLinkStub.should.have.been.calledOnce;
                                sendVerificationLinkStub.restore();
                                done();
                            });
                        var req = {
                            body: {
                                name: 'Full name',
                                email: 'test@test.com',
                                username: 'user',
                                password: 'password'
                            }
                        };

                        usersController.create(req, {});
                    });
            });
        });
    });

