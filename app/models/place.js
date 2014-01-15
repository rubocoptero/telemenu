global.appContainer.resolve(function (PlaceStore) {
    var place = function () {
        var self = {};
        var store = PlaceStore;

        self.create = function (doc, imagePath, cb) {
            store.createWithImage(doc, imagePath, cb);
        };

        return self;
    };

    module.exports = place();
});
