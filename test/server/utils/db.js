global.appContainer.resolve(function (mongoose) {
    before(function(done) {
        mongoose.connection.on('open',
            function() {
                mongoose.connection.db.dropDatabase(done);
            });
    });

    module.exports = function() {
        afterEach(function(done) {
            mongoose.connection.db.dropDatabase(done);
        });
    };

    // Another way of cleaning db
    var clearDB = function(done) {
        for(var collection in mongoose.connection.collections) {
            mongoose.connection.collections[collection].remove();
        }

        return done();
    };
});

