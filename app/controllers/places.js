var appContainer = require('../../config/dependencies/container');

appContainer.resolve(function (PlaceStore, _) {
    exports.create = function(req, res, next) {
        req.body.user = req.user;
        PlaceStore.createWithImage(req.body.place, req.files.image.path, function (err, savedPlace) {
            if (err) return next(err);
            res.jsonp(savedPlace);
        });
    };

    exports.update = function (req, res, next) {
        var place = req.place;
        place = _.extend(place, req.body);

        place.save(function(err) {
            if (err) return next(err);

            res.jsonp(place);
        });
    };

    exports.destroy = function (req, res, next) {
        var place = req.place;
        place.remove(function(err) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(place);
            }
        });
    };

    exports.mine = function (req, res, next) {
        PlaceStore.findByUserId(req.user.id, function (err, places) {
            if (err) return next(err);

            res.jsonp({places: places});
        });
    };

    exports.place = function (req, res, next, id) {
        PlaceStore.load(id, function(err, place) {
            if (err) return next(err);
            if (!place) return next(new Error('Falló al cargar el local ' + id));
            req.place = place;
            next();
        });
    };
});
