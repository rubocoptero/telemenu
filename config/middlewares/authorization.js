var messages = {
    notAuthenticated: 'Es necesario estar autenticado',
    notAuthorized: 'El usuario no posee los permiso necesarios',
    notVerified: 'El usuario no ha verificado su cuenta.'
};

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send(401, messages.notAuthenticated);
    }
    next();
};

exports.requiresVerification = function(req, res, next) {
    if (!req.user.verified) {
        return res.send(401, messages.notVerified);
    }
    next();
};

exports.haveToLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/signin?afterGoTo=' + req.path);
    }
    next();
};

/**
 * User authorizations routing middleware
 */
exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id !== req.user.id) {
            return res.send(403, messages.notAuthorized);
        }
        next();
    }
};

/**
 * Article authorizations routing middleware
 */
exports.article = {
    hasAuthorization: function(req, res, next) {
        console.log(req.user);
        console.log(req.article.user);
        if (req.article.user.id !== req.user.id) {
            return res.send(403, messages.notAuthorized);
        }
        next();
    }
};

exports.place = {
    hasAuthorization: function (req, res, next) {
        if (req.place.user.id !== req.user.id) {
            return res.send(403, messages.notAuthorized);
        }
        next();
    }
};
