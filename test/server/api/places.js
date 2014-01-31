global.appContainer.resolve(function (UserStore, dbTestUtil, passportStub, TestPlace, PlaceStore, mongoose, fixtures) {
    describe('Places API:', function() {
        dbTestUtil();
        var userId, placeId;

        before(function() {
            userId = fixtures.getUserId();
            placeId = fixtures.getPlaceId();
        });

        describe('User authorized', function() {
            before(function(done) {
                passportStub.install(app);
                fixtures.getLoginUser(function(err, user) {
                    passportStub.login(user);
                    done(err);
                });
            });

            after(function() {
                passportStub.uninstall(app);
            });

            it('GET /places/ should show all placed which own the logged user',
                function(done) {
                    fixtures.loadPlaces(function() {
                        request(app)
                            .get('/places')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                var retrievedPlaces = JSON.parse(res.text);
                                retrievedPlaces.places.should.have.length(1);
                                retrievedPlaces.places[0].name
                                    .should.be.equal('The Awesome Place');
                                done();
                            });
                    });
                });

            it('POST /places/ should create a new place with image',
                function(done) {
                    var placeImage = fixtures.getPlaceImage(),
                        placeData = fixtures.getPlaceData();

                    request(app)
                        .post('/places')
                        .attach('image', placeImage)
                        .field('place', JSON.stringify(placeData))
                        .expect(200)
                        .end(function(err, res) {
                            if (err) return done(err);
                            PlaceStore.count({}, function(err, count) {
                                count.should.be.equal(1);
                            });
                            done();
                        });
                });

            it('PUT /places/<placeId> should update a place',
                function(done) {
                    var newName = 'Dreadful place';
                    var newLng = 482939.198319;
                    fixtures.loadPlaces(function () {
                        PlaceStore.findById(placeId, function(err, place) {
                            place.name = newName;
                            place.address.lng = newLng;

                            request(app)
                                .put('/places/' + placeId)
                                .attach(
                                    'image',
                                    fixtures.getPlaceImage()
                                )
                                .field('place', JSON.stringify(place))
                                .expect(200)
                                .end(function (err, res) {
                                    if (err) return done(err);

                                    var updatedPlace = JSON.parse(res.text);
                                    updatedPlace.name.should.be.equal(newName);
                                    updatedPlace.address.lng.should.be.equal(newLng);
                                    done();
                                });
                        });
                    });
                });

            it('DEL /places/<placeId> should delete a place when user authenticated is the owner',
                function(done) {
                    fixtures.loadPlaces(function () {
                        request(app)
                            .del('/places/' + placeId)
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                PlaceStore.count({_id: placeId},
                                    function(err, count) {
                                        count.should.be.equal(0);
                                        done(err);
                                    });
                            });
                    });
                });

            it('GET /places/<placeId> should return a place', function(done) {
                fixtures.loadPlaces(function () {
                    request(app)
                        .get('/places/' + placeId)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) return done(err);
                            var realPlace = JSON.parse(res.text);
                            var expectedPlace = fixtures.getPlaceData();
                            realPlace.name.should.be.equal(expectedPlace.name);
                            done();
                        });
                });
            });
        });
    });
});
