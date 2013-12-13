var mongoose = require('mongoose'),
    VerificationToken = mongoose.model('VerificationToken'),
    users = require('../../app/controllers/users');

describe('<Integration Test>', function() {
    describe('Routing:', function() {
        // it('POST request to /users/ should create a new user, new token and send a mail', function() {

        // });

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
