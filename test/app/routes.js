var mongoose = require('mongoose'),
    VerificationToken = mongoose.model('VerificationToken'),
    User = mongoose.model('User'),
    users = require('../../app/controllers/users'),
    db = require('../utils/db'),
    mailer = require('../../app/controllers/mailer');

describe('<Integration Test>', function() {
    describe('Routing:', function() {
        db();

        it('POST /users/ should create a new user, new token and send a mail', function(done) {
            this.timeout(6000);
            var sendVerificationSpy = sinon.spy(mailer, 'sendVerificationLink');
            var user = {
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            };

            request(app)
                .post('/users/')
                .send(user)
                .expect(200)
                .end(function(err, res) {
                    sendVerificationSpy.should.have.been.calledOnce;
                    User.find({}, function(err, users) {
                        users.should.have.length(1);
                        VerificationToken.find({}, function(err, tokens) {
                            tokens.should.have.length(1);
                            done();
                        });
                    });
                });
        });

        it('GET /verificacion/<token> should validate an user', function(done) {
            this.timeout(6000);
            var user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });

            user.provider = 'local';
            user.save(function(err) {
                should.not.exist(err);
                VerificationToken.createFor(user, function(err, createdToken) {
                    should.not.exist(err);
                    console.log(createdToken);
                    token = createdToken.token;

                    user.verified.should.be.false;

                    request(app)
                        .get('/verification/' + token)
                        .expect(200)
                        .end(function(err, res) {
                            console.log(res);
                            User.findById(user._id, function(err, retrievedUser) {
                                cosole.log(retrievedUser);
                                retrievedUser.verified.should.be.true;
                                done();
                            });
                        });
                });
            });
        });

        // it('using a token does not store for verify user', function(done) {
        //     var token = 'tokenDoesNotMatch';
        //     var VerificationTokenMock = sinon.mock(VerificationToken);
        //     VerificationTokenMock
        //         .expects('getUserByToken').once().returns();
        //     request(app)
        //         .get('/verify/' + token)
        //         .end(function (err, res) {
        //             if (err) throw err;
        //             VerificationTokenMock.verify();
        //             VerificationTokenMock.restore();
        //             done();
        //         });
        //     VerificationTokenMock.verify();
        //     VerificationTokenMock.restore();
        // });

        // it('using a token does not store for verify user SPYING', function(done) {
        //     var token = 'tokenDoesNotMatch';
        //     var getUserByTokenSpy = sinon.spy(
        //         VerificationToken,
        //         'getUserByToken'
        //     );
            // request(app)
            //     .get('/verify/' + token)
            //     .end(function (err, res) {
            //         console.log(err);
            //         if (err) throw err;
            //         getUserByTokenSpy.should.be.calledOnce;
            //         getUserByTokenSpy.restore();
            //         done();
            //     });
        // });

        // it('using a token does not store for verify user stub', function(done) {
        //     var token = 'tokenDoesNotMatch';
        //     var verifyStub = sinon.stub(
        //         users,
        //         'verify',
        //         function(req, res, next, token) {
        //             token.should.not.be.equal(token);
        //             req.verified = true;
        //             next();
        //         }
        //     );

        //     request(app)
        //         .get('/verify/' + token)
        //         .end(function (err, res) {
        //             if (err) throw err;

        //             verifyStub.restore();
        //             done();
        //         });
        // });


    });
});
