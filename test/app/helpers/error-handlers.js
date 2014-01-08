var errorHandler = require('../../../app/helpers/error-handlers.js');

describe('<Unit Test>', function() {
    describe('Errors handler', function() {
        describe('for Mongoose', function() {
            it('should return an duplicated field error', function() {
                var err = {
                    name: 'MongoError',
                    code: 11000,
                    err: 'E11000 duplicate key error index: mean-dev.users.$email_1  dup key: { : "email@exist.com" }'
                };

                var errorMessage = errorHandler.forMongoose(err);

                errorMessage.should.have.string('ya existe');
                errorMessage.should.have.string('email@exist.com');
            });

            it('should return an another duplicated field error', function() {
                var err = {
                    name: 'MongoError',
                    code: 11000,
                    err: 'E11000 duplicate key error index: mean-dev.users.$username_1  dup key: { : "ru" }'
                };

                var errorMessage = errorHandler.forMongoose(err);

                errorMessage.should.have.string('ya existe');
                errorMessage.should.have.string('ru');
            });
        });
    });
});
