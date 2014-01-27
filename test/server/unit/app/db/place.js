global.appContainer.resolve(function (PlaceStore, UserStore, TestPlace, fixtures){
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

            it('should get all users\'s places by userId', function(done) {
                fixtures.loadPlaces(function() {
                    PlaceStore.findByUserId(fixtures.getUserId(),
                        function (err, places) {
                            should.not.exist(err);
                            places.should.have.length(1);
                            places[0].name.should.be.equal('The Awesome Place');
                            UserStore.remove({}).exec(done);
                        });
                })
            })
        });
    });
});

