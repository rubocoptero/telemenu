global.appContainer.resolve(function (PlaceStore, UserStore, TestPlace){
    describe('<Integration Test>', function() {
        describe('Model Place:', function() {
            afterEach(function(done) {
                PlaceStore.remove({}).exec(done);
            });

            it('should save itself with an image', function(done) {
                var place = PlaceStore.createWithImage(
                    TestPlace.getDataWithoutImage(),
                    TestPlace.getImage(),
                    function(err) {
                        should.not.exist(err);
                        done();
                    }
                );
            });
        });
    });
});

