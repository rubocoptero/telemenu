var urlHelper = require('../app/helpers/url');


module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);

    //Setting up the users api
    app.post('/users', users.create);

    app.post('/users/session', function(req, res, next) {
        var failtureUrl = urlHelper.buildUrlWithParams(
            '/signin',
            req.query
        );
        passport.authenticate('local', {
            failureRedirect: failtureUrl,
            failureFlash: 'Email o contraseña incorrecta.'
        })(req, res, next);
    }, users.session);

    app.get('/users/me', users.me);
    app.get('/users/:userId', users.show);


    //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        successRedirect: '/',
        scope: ['email', 'user_about_me'],
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    //Verification Routes
    var verification = require('../app/controllers/verification');

    app.get('/verificacion/reenviar', auth.haveToLogin, verification.resend);
    app.get('/verificacion/:token', verification.verification);
    app.param('token', verification.verify);

    // Places Routes
    var places = require('../app/controllers/places');
    app.get('/places', auth.requiresLogin, places.mine);
    app.post('/places', auth.requiresLogin, places.create);
    app.get('/places/:placeId', places.show);
    app.put('/places/:placeId', auth.requiresLogin, auth.place.hasAuthorization, places.update);
    app.del('/places/:placeId', auth.requiresLogin, auth.place.hasAuthorization, places.destroy);

    app.param('placeId', places.place);

    //Article Routes
    var articles = require('../app/controllers/articles');
    app.get('/articles', articles.all);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:articleId', articles.show);
    app.put('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.update);
    app.del('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);

    //Finish with setting up the articleId param
    app.param('articleId', articles.article);

    // Menu Routes
    var menus = require('../app/controllers/menus');
    app.get('/menus', menus.all);
    app.post('menus', auth.requiresLogin, menus.create);
    app.get('/menus/:menuId', menus.show);
    app.put('/menus/:menuId', auth.requiresLogin, menus.update);
    app.del('/menus/:menuId', auth.requiresLogin, menus.destroy);

    app.param('menuId', menus.menu);


    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

};
