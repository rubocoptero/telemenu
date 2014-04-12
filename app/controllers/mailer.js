var globals = require('../../config/globals');

module.exports.sendVerificationLink = function(sendTo, verificationLink, callbackFn) {
    var transport = globals.mailTransport;
    var mailOptions = {
        from: 'Rubén de Telemenu <rubodetelemenu@gmail.com>',
        to: sendTo,
        subject: 'Bienvenido a Telemenu',
        text: 'Por favor, confirma tu registro en el siguiente enlace: ' + verificationLink,
        html: '<p>Por favor, <b>confirma tu registro</b> en el siguiente enlace:</p><a href="' + verificationLink + '">' + verificationLink + '</a>'
    };

    transport.sendMail(mailOptions, callbackFn);
};
