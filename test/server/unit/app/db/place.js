global.appContainer.resolve(function (PlaceStore, UserStore, TestPlace, fixtures){
    describe('<Integration Test>', function() {
        describe('Model Place:', function() {
            afterEach(function(done) {
                PlaceStore.remove({}).exec(done);
            });

            it('should create a place with an image', function(done) {
                var data = TestPlace.getDataWithoutImage(), imagePath = TestPlace.getImage();
                var place = PlaceStore.createWithImage(
                    data,
                    imagePath,
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
                });
            });

            it('should save a place with its image', function (done) {
                var newLng = 666;
                PlaceStore.createWithImage(
                    fixtures.getPlaceData(),
                    fixtures.getPlaceImage(),
                    function (err, createdPlace) {
                        should.not.exist(err);
                        createdPlace.address.lng = newLng;
                        createdPlace.saveWithImage(
                            fixtures.getPlaceImage(),
                            function (err, savedPlace) {
                                should.not.exist(err);
                                savedPlace.address.lng.should.be.equal(newLng);
                                done();
                            });
                    });
            });

            it('should save a place without image', function (done) {
                var newLng = 666;
                PlaceStore.createWithImage(
                    fixtures.getPlaceData(),
                    fixtures.getPlaceImage(),
                    function (err, createdPlace) {
                        should.not.exist(err);
                        createdPlace.address.lng = newLng;
                        createdPlace.saveWithImage(
                            null,
                            function (err, savedPlace) {
                                should.not.exist(err);
                                console.log(savedPlace);
                                savedPlace.address.lng.should.be.equal(newLng);
                                done();
                            });
                    });
            });
        });
    });
});

