global.appContainer.resolve(function (mongoose, Place, TestPlace) {
    describe('Place Domain Model', function() {
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
});

