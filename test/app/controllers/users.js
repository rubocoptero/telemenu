var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    VerificationToken = mongoose.model('VerificationToken'),
    users = require('../../../app/controllers/users'),
    mailer = require('../../../app/controllers/mailer'),
    globals = require('../../../config/globals');



describe('<Integration Test>', function() {
    describe('Controller Users:', function() {
        afterEach(function(done) {
            VerificationToken.remove().exec(function() {
                User.remove().exec(done);
            });
        });

        it('should send a token when an user has been created',
            function(done) {
                var sendVerificationLinkStub = sinon.stub(mailer, 'sendVerificationLink', function() {
                        /* jshint expr: true */
                        sendVerificationLinkStub.should.have.been.calledOnce;
                        done();
                    });
                var logInHasBeenCalled = false;
                var req = {
                    body: {
                        name: 'Full name',
                        email: 'test@test.com',
                        username: 'user',
                        password: 'password'
                    }
                };

                users.create(req, {});
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
            var user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password',
                verified: false
            });
            user.save(function(err, savedUser) {
                var verificationToken = new VerificationToken({
                    user: savedUser._id
                });
                verificationToken.save(function(err, savedToken) {
                    users.verify(
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

                users.verify(
                    req,
                    undefined,
                    assertion,
                    'doesNotMatch'
                );
            });

        // it('should verify a user using a token with handmade stubs', function(done) {
        //     var tokenFindOneReal = VerificationToken.findOne;
        //     var userFindOneReal = User.findOne;
        //     var returnedUser = {
        //         verified: false,
        //         save: function(cb) {}
        //     };
        //     VerificationToken.findOne = function(params, cb) {
        //         cb(undefined, {_userId: 'id'});
        //     };
        //     User.findOne = function(params, cb) {
        //         cb(undefined, returnedUser);
        //     };

        //     users.verify(
        //         undefined,
        //         undefined,
        //         done,
        //         'token'
        //     );

        //     returnedUser.verified.should.be.ok;
        //     VerificationToken.findOne = tokenFindOneReal;
        //     User.findOne = userFindOneReal;
        //     done();
        // });

        // it('should verify a user using a token with sinon stubs', function(done) {
        //     var returnedUser = {
        //         verified: false,
        //         save: function(cb) {}
        //     };
        //     var returnedToken = {
        //         _userId: 'id'
        //     };
        //     var tokenFindOneStub = sinon.stub(VerificationToken, 'findOne',
        //         function(params, cb) {
        //             cb(undefined, {_userId: 'id'});
        //         });
        //     var userFindOneStub = sinon.stub(User, 'findOne',
        //         function(params, cb) {
        //             cb(undefined, returnedUser);
        //         });

        //     users.verify(
        //         undefined,
        //         undefined,
        //         done,
        //         'token'
        //     );

        //     returnedUser.verified.should.be.ok;
        //     tokenFindOneStub.restore();
        //     userFindOneStub.restore();
        //     done();
        // });


    });
});
