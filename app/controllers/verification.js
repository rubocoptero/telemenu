var VerificationToken = require('../models/verification-token');

exports.verification = function(req, res) {
    res.redirect('/');
    // res.jsonp(req.verified || null);
};

exports.verify = function(req, res, next, token) {
    VerificationToken.getUserByToken(token, function(err, resultUser) {
        if (err) return next(err);
        if (!resultUser) {
            req.flash(
                'errors',
                'La verificación ha fallado. Es posible que su código de verificación haya caducado.'
            );
            return next();
        }
        resultUser.verified = true;
        resultUser.save(function(err, savedUser) {
            if (err) return next(err);
            req.verified = savedUser.verified;
            req.flash('success', 'Felicidades! Su registro se ha completado con éxito. Ya es uno más de nuestros usuarios.');
            next();
        });
    });
};

exports.resend = function(req, res) {
    res.jsonp('Reenviada');
};
