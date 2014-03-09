global.appContainer.resolve(function (MenuStore, PlaceStore, fixtures, mongoose) {
    describe('<Integration Test>', function () {
        describe('Model Menu:', function () {
            it('should save itself', function (done) {
                var menuData = {
                    place: mongoose.Schema.ObjectId(),
                    price: 10.50,
                    sections: [
                        {
                            name: 'Main dish',
                            foods: [
                                'Meat',
                                'Fish'
                            ]
                        },
                        {
                            name: 'Dessert',
                            foods: [
                                'Fruit',
                                'Cake'
                            ]
                        }
                    ],
                    available: [{
                        days: ['Sat', 'Sun'],
                        hours: [{
                            from: 720,
                            to: 940
                        }]
                    }]
                };

                var menu = new MenuStore(menuData);
                menu.save(function (err, saved) {
                    should.not.exist(err);
                    saved.price.should.be.equal(10.5);
                    done();
                });
            });

            it('should populate field place', function (done) {
                fixtures.loadMenus(function () {
                    MenuStore.load(
                        fixtures.getMenuId(),
                        function(err, menu) {
                            should.not.exist(err);
                            menu.place.address.lng.should.be.equal(-3.7492200000000366);
                            done();
                        }
                    );
                });
            });
        });
    });
});
