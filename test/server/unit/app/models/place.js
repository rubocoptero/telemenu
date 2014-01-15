global.appContainer.resolve(function (mongoose, Place, TestPlace) {
    describe('Place Domain Model', function() {
        it('should create a place', function(){
            Place.create(
                TestPlace.getData(),
                TestPlace.getImage(),
                function(err) {
                    should.not.exist(err);
                    done();
                }
            );
        });

        it('should create a place without image', function(){
            Place.create(
                TestPlace.getData(),
                function(err) {
                    should.not.exist(err);
                    done();
                }
            );
        });
    });
});

