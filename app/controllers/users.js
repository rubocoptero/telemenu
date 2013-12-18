/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    VerificationToken = mongoose.model('VerificationToken'),
    mailer = require('./mailer'),
    errorHandler = require('../helpers/error-handlers');

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res) {
    var user = new User(req.body);

    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            return res.render('users/signup', {
                message: errorHandler.forMongoose(err),
                user: user
            });
        }
        VerificationToken.createFor(user, function(err) {
            if (err) return next(err);
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                } else {
                    req.flash(
                        'success',
                        'Te hemos enviado un correo electrónico que contiene un enlace de verificación para completar tu registro.'
                    );
                }
                return res.redirect('/');
            });
        });
    });
};

/**
 *  Show profile
 */
exports.show = function(req, res) {
    var user = req.profile;

    res.render('users/show', {
        title: user.name,
        user: user
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};

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
