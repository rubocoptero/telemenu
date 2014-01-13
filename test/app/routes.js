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
                    token = createdToken.token;

                    user.verified.should.be.false;

                    request(app)
                        .get('/verificacion/' + token)
                        .expect(200)
                        .end(function(err, res) {
                            User.findById(user._id, function(err, retrievedUser) {
                                retrievedUser.verified.should.be.true;
                                done();
                            });
                        });
                });
            });
        });

        // it('GET /verificacion/reenviar should resend a new token to the user mail address', function() {

        //     request(app)
        //         .get('/verificacion/reenviar')
        //         .expect(200)
        //         .end(function(err, res) {

        //         });
        // });


    });
});
