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
                new User(user).save(function(err) {
                    users.create(req, res);
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

                users.create(req, {});
            });


    });
});
