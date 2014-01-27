global.appContainer.resolve(function (mongoose, fixtures, Place, TestPlace) {
    describe('Place Repository', function() {
        describe('Create', function () {
            it('should create a place with image', function(done){
                var placeData = TestPlace.getDataWithImage();
                placeData.should.have.image;

                Place.create(
                    placeData,
                    function(err, createdPlace) {
                        should.not.exist(err);
                        createdPlace.name.should.be.equal(placeData.name);
                        createdPlace.image.thumb.path.should.exists;
                        done();
                    }
                );
            });

            it('should create a place without image', function(done){
                var placeData = TestPlace.getDataWithoutImage();
                placeData.should.not.have.image;

                Place.create(
                    placeData,
                    function(err, createdPlace) {
                        should.not.exist(err);
                        createdPlace.name.should.be.equal(placeData.name);
                        done();
                    }
                );
            });
        });
        // describe('Read', function() {
        //     it('should retrieve all places by a given user', function(done) {
        //         fixtures.load(fixturePlaces, mongoose.connection, done);


        //     });
        // });

        // describe('Delete', function() {
        //     it('should delete a place by id', function(done) {
        //         fixtures.load(fixturePlaces, mongoose.connection, done);


        //     });
        // });
    });
});

