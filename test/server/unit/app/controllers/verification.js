global.appContainer.resolve(function (UserStore, VerificationTokenStore, verificationController) {
    describe('<Unit Test>', function() {
        describe('Verification Controller:', function() {
            afterEach(function(done) {
                VerificationTokenStore.remove().exec(function() {
                    UserStore.remove().exec(done);
                });
            });

            it('should verify a user by token', function(done) {
                    var assertion = function(err) {
                        /* jshint expr: true */
                        req.verified.should.be.ok;
                        done();
                    };
                    var req = {
                        verified: false,
                        flash: function() {}
                    };
                    var user = new UserStore({
                        name: 'Full name',
                        email: 'test@test.com',
                        username: 'user',
                        password: 'password',
                        verified: false
                    });
                    user.save(function(err, savedUser) {
                        var verificationToken = new VerificationTokenStore({
                            user: savedUser._id
                        });
                        verificationToken.save(function(err, savedToken) {
                            verificationController.verify(
                                req,
                                undefined,
                                assertion,
                                savedToken.token
                            );
                        });
                    });
                });

            it('should throw an error when token does not match any user',
                function(done) {
                    var assertion = function(err, resultUser) {
                        req.flash.should.have.been.calledOnce;
                        //should.exist(err);
                        done();
                    };
                    var req = {
                        flash: sinon.spy()
                    };

                    verificationController.verify(
                        req,
                        undefined,
                        assertion,
                        'doesNotMatch'
                    );
                });

            it('should create a new token and send an email', function(done) {
                var sandbox = sinon.sandbox.create();
                var createForStub = sandbox.stub(VerificationTokenStore, 'createFor',
                    function(user, cb) {
                        cb();
                        createForStub.should.be.calledOne;
                        sandbox.restore();
                        req.flash.should.be.calledOnce;
                        req.flash.should.be.calledWith('success');
                        res.redirect.should.be.calledOnce;
                        done();
                    });
                var req = {
                    flash: sinon.spy()
                };
                var res = {
                    redirect: sinon.spy()
                };

                verificationController.resend(req, res);
            });

            it('should flash something when an error hapends', function(done) {
                var sandbox = sinon.sandbox.create();
                var createForStub = sandbox.stub(VerificationTokenStore, 'createFor',
                    function(user, cb) {
                        cb(new Error('Error'));
                        createForStub.should.be.calledOne;
                        sandbox.restore();
                        req.flash.should.be.calledOnce;
                        req.flash.should.be.calledWith('errors');
                        res.redirect.should.be.calledOnce;
                        done();
                    });
                var req = {
                    flash: sinon.spy()
                };
                var res = {
                    redirect: sinon.spy()
                };

                verificationController.resend(req, res);
            });
        });
    });
});

