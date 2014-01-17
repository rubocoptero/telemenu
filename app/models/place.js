global.appContainer.resolve(function (PlaceStore) {
    var place = function () {
        var self = {};
        var store = PlaceStore;

        self.create = function (doc, cb) {
            if (doc.hasOwnProperty('image')) {
                var imagePath = doc.image;
                delete doc.image;
                store.createWithImage(doc, imagePath, cb);
            }
            else {
                store.create(doc, cb);
            }
        };

        return self;
    };

    module.exports = place();
});
