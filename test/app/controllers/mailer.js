var mailer = require('../../../app/controllers/mailer'),
    globals = require('../../../config/globals');

describe('<Unit Test>', function() {
    describe('Mailer util:', function() {
        describe('sendVerificationLink', function() {
            it('should send a mail through predefined transport', function() {
                var transport = globals.mailTransport;
                var mock = sinon.mock(transport);
                mock.expects('sendMail').once().returns({});

                mailer.sendVerificationLink('user@domain.com', 'token', function() {});

                mock.verify();
                mock.restore();
            });

            it('should send a mail with the verification link and destination address', function() {
                var verificationLinkExpected = 'this is a verification link';
                var mailExpected = 'user@domain.com';
                var transport = globals.mailTransport;
                var mailOptionsReal;
                var sendMailStub = sinon.stub(transport, 'sendMail',
                    function(mailOptions, cb) {
                        mailOptionsReal = mailOptions;
                    });

                mailer.sendVerificationLink('user@domain.com', verificationLinkExpected, function() {});

                mailOptionsReal.to.should.have.string(mailExpected);
                mailOptionsReal.html.should.have.string(verificationLinkExpected);
                mailOptionsReal.text.should.have.string(verificationLinkExpected);
                /* jshint expr: true */
                sendMailStub.should.have.been.calledOnce;
                sendMailStub.restore();
            });
        });
    });
});
