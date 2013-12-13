var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    VerificationToken = mongoose.model('VerificationToken'),
    User = mongoose.model('User');

describe('<Unit Test>', function() {
    var verificationToken;

    describe('Model VerificationToken:', function() {
        beforeEach(function() {
            verificationToken = new VerificationToken({
                user: mongoose.Types.ObjectId()
            });
        });

        afterEach(function(done) {
            verificationToken = null;
            VerificationToken.remove({}).exec(done);
        });

        it('should begin with no tokens', function(done) {
            VerificationToken.find({}, function(err, tokens) {
                tokens.should.have.length(0);
                done();
            });
        });

        it('should generate a new token when save', function(done) {
            verificationToken.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should throw an error when the token already exists', function(done) {
            var anotherVerificationToken = new VerificationToken({
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

        it('should throw an error when the user already exists', function(done) {
            var anotherVerificationToken = new VerificationToken({
                user: verificationToken.user
            });
            verificationToken.user.should.equal(anotherVerificationToken.user);

            verificationToken.save(function() {
                anotherVerificationToken.save(function(err) {
                    should.exist(err);
                    err.code.should.be.equal(11000);
                    done();
                });
            });
        });
    });
    describe('Statics VerificationToken:', function() {
        var user;

        beforeEach(function(done) {
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });
            user.save(function(err, userSaved) {
                verificationToken = new VerificationToken({
                    user: userSaved._id
                });
                verificationToken.save(done);
            });
        });

        afterEach(function(done) {
            verificationToken = null;
            user = null;
            VerificationToken.remove({}).exec(function() {
                User.remove({}).exec(done);
            });
        });

        it('should populate user properly', function(done) {
            VerificationToken.populatedFindByToken(verificationToken.token,
                function(err, tokenPopulated) {
                    tokenPopulated.user.username.should.be.equal(user.username);
                    done();
                });
        });

        it('should get a null result when token is not store',
            function(done) {
                VerificationToken.populatedFindByToken('doesNotExist',
                    function(err, resultUser) {
                        should.not.exist(err);
                        should.not.exist(resultUser);
                        done();
                    });
            });

        it('should get a null result when the user of token does not exist',
            function(done) {
                user.remove(function() {
                    VerificationToken.populatedFindByToken(
                        verificationToken.token,
                        function(err, resultUser) {
                            should.not.exist(err);
                            should.not.exist(resultUser.user);
                            done();
                        });
                });
            });

        it('should get user by token', function(done) {
            VerificationToken.getUserByToken(verificationToken.token,
                function(err, resultUser) {
                    resultUser.username.should.be.equal(user.username);
                    done();
                });
        });

        it('should get a null result when search user by a token which does not exist', function(done) {
            VerificationToken.getUserByToken('doesNotExist',
                function(err, resultUser) {
                    should.not.exist(err);
                    should.not.exist(resultUser);
                    done();
                });
        });

        it('should get a null result when there is not user by the given token', function(done) {
            user.remove(function() {
                VerificationToken.getUserByToken(verificationToken.token,
                    function(err, resultUser) {
                        should.not.exist(err);
                        should.not.exist(resultUser);
                        done();
                    });
            });
        });
    });
});
