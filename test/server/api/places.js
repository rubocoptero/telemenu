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
                    var placeImage = fixtures.getPlaceImage();

                    request(app)
                        .post('/places')
                        .attach('image', placeImage, 'restaurant.jpg')
                        .field('place[name]', 'The Awesome Place')
                        .field('place[address][str]', '6 Awesome St.')
                        .field('place[address][lat]', '40.46366700000001')
                        .field('place[address][lng]', '-3.7492200000000366')
                        .field('place[description]', 'Yeah! it is awesome')
                        .field('place[telephone]', '666666666')
                        .field('place[reservations_constrains][capacity]', '1')
                        .field('place[reservations_constrains][minutes_per_customer]', '60')
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
                                .send(place)
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
        });
    });
});
