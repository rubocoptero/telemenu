var mailer = require('../../../app/controllers/mailer'),
    globals = require('../../../config/globals');

describe('<Unit Test>', function() {
    describe('Mailer util:', function() {

        it('should send a confirmation mail', function() {
            var transport = globals.mailTransport;
            var mock = sinon.mock(transport);
            mock.expects('sendMail').once().returns({});

            mailer.sendConfirmation('user@domain.com', function() {});

            mock.verify();
            mock.restore();
        });
    });
});
