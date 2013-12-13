var nodemailer = require('nodemailer');

var mailTransport;

var getMailTransport = function() {
    if (!mailTransport) {
        mailTransport = nodemailer.createTransport(
            'SMTP',
            {
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER || 'rubendetelemenu@gmail.com',
                    pass: process.env.EMAIL_PASS || 'password'
                },
                debug: process.env.DEBUG_MAILER ||
                    ((process.env.NODE_ENV !== 'production') ? true : false)
            }
        );
    }

    return mailTransport;
};

module.exports.mailTransport = getMailTransport();

