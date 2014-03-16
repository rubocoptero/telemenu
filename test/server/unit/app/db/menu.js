global.appContainer.resolve(function (MenuStore, PlaceStore, fixtures, mongoose) {
    describe('<Integration Test>', function () {
        describe('Model Menu:', function () {
            it('should save itself', function (done) {
                var menuData = {
                    user: new mongoose.Types.ObjectId(),
                    place: new mongoose.Types.ObjectId(),
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
                        days: ['Saturday', 'Sunday'],
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
                    done(err);
                });
            });

            it('should throw an error when there is no sections', function (done) {
                var menuData = {
                    user: new mongoose.Types.ObjectId(),
                    place: new mongoose.Types.ObjectId(),
                    price: 10.50,
                    sections: [],
                    available: [{
                        days: ['Saturday', 'Sunday'],
                        hours: [{
                            from: 720,
                            to: 940
                        }]
                    }]
                };

                var menu = new MenuStore(menuData);
                menu.save(function (err, saved) {
                    should.exist(err);
                    err.should.have.deep.property('errors.sections.path', 'sections');
                    err.should.have.deep.property('errors.sections.type', 'required');
                    done();
                });
            });

            it('should throw an error when there is no food in a section', function (done) {
                var menuData = {
                    user: new mongoose.Types.ObjectId(),
                    place: new mongoose.Types.ObjectId(),
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
                            foods: []
                        }

                    ],
                    available: [{
                        days: ['Saturday', 'Sunday'],
                        hours: [{
                            from: 720,
                            to: 940
                        }]
                    }]
                };

                var menu = new MenuStore(menuData);
                menu.save(function (err, saved) {
                    should.exist(err);
                    err.errors['sections.1.foods'].path.should.be.equal('foods');
                    err.errors['sections.1.foods'].type.should.be.equal('required');
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
