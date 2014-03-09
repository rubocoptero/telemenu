var appContainer = require('../../config/dependencies/container');

appContainer.resolve(function (MenuStore, _) {
    exports.create = function (req, res) {
        var menu = new MenuStore(req.body);
        menu.user = req.user;
        // fill stuff
        menu.save();
        res.jsonp(menu);
    };

    exports.show = function (req, res) {
        res.jsonp(req.menu);
    };

    exports.menu = function(req, res, next, id) {
        MenuStore.load(id, function(err, menu) {
            if (err) return next(err);
            if (!menu) return next(new Error('Falló al cargar menu' + id));
            req.menu = menu;
            next();
        });
    };

    exports.all = function(req, res) {
        MenuStore.find().populate('user').exec(function(err, menus) {
            if (err) {
                res.render('error', {status: 500});
            } else {
                res.jsonp(menus);
            }
        });
    };

    exports.update = function(req, res) {
        var menu = req.menu;
        menu = _.extend(menu, req.body);

        menu.save(function(err) {
            res.jsonp(menu);
        });
    };

    exports.destroy = function(req,res) {
        var menu = req.menu;
        menu.remove(function (err) {
            if (err) {
                res.render('error', {status: 500});
            } else {
                res.jsonp(1);
            }
        });
    };
});

