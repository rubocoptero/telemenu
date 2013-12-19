var User = require('../../../app/models/user'),
    VerificationToken = require('../../../app/models/verification-token'),
    verification = require('../../../app/controllers/verification');

describe('Verification Controller:', function() {
    afterEach(function(done) {
        VerificationToken.remove().exec(function() {
            User.remove().exec(done);
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
                    verification.verify(
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

                verification.verify(
                    req,
                    undefined,
                    assertion,
                    'doesNotMatch'
                );
            });


});
