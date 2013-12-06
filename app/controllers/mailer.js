var globals = require('../../config/globals');

module.exports.sendConfirmation = function(sendTo, callbackFn) {
    var transport = globals.mailTransport;
    var mailOptions = {
        from: 'Rubén de Telemenu <rubendetelemenu@gmail.com>',
        to: sendTo,
        subject: 'Bienvenido a Telemenu',
        text: 'Por favor, confirma tu registro en el siguiente enlace',
        html: '<p>Por favor, <b>confirma tu registro</b> en el siguiente enlace</p>'
    };

    var cb = function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('Message sent: ' + response.message);
        }
    };

    transport.sendMail(mailOptions, callbackFn);
};
