var appContainer = require('../../config/dependencies/container');

appContainer.resolve(function (UserStore, VerificationTokenStore, errorHandler, urlHelper) {
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
        var actionUrl = urlHelper.buildUrlWithParams(
            '/users/session',
            req.query
        );

        res.render('users/signin', {
            title: 'Signin',
            message: req.flash('error'),
            actionValue: actionUrl
        });
    };

    /**
     * Show sign up form
     */
    exports.signup = function(req, res) {
        res.render('users/signup', {
            title: 'Sign up',
            user: new UserStore()
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
        if (req.query.afterGoTo) {
            return res.redirect(req.query.afterGoTo);
        }
        res.redirect('/');
    };

    /**
     * Create user
     */
    exports.create = function(req, res, next) {
        var user = new UserStore(req.body);

        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                return res.render('users/signup', {
                    message: errorHandler.forMongoose(err),
                    user: user
                });
            }
            VerificationTokenStore.createFor(user, function(err) {
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
     * Send UserStore
     */
    exports.me = function(req, res) {
        res.jsonp(req.user || null);
    };

    /**
     * Find user by id
     */
    exports.user = function(req, res, next, id) {
        UserStore
            .findOne({
                _id: id
            })
            .exec(function(err, user) {
                if (err) return next(err);
                if (!user) return next(new Error('Failed to load UserStore ' + id));
                req.profile = user;
                next();
            });
    };
});
