var path = require('path'),
    container = require('dependable').container();

// App config
container.register('uploadPath',
    path.resolve(__dirname, '../../public/img/uploads'));

// App dependencies
container.register('_', function() {
    return require('underscore');
});
// Persistence Drivers
container.register('mongoose', require('mongoose'));
container.register('mongooseAttachments', function () {
    var attachments = require('mongoose-attachments'),
        LocalfsStorage = require('mongoose-attachments-localfs');

    attachments.registerStorageProvider('localfs', LocalfsStorage);

    return attachments;
});

// Persistence Abstractions
container.register('UserStore', function (mongoose) {
    return mongoose.model('User');
});
container.register('PlaceStore', function (mongoose) {
    return mongoose.model('Place');
});
container.register('VerificationTokenStore', function (mongoose) {
    return mongoose.model('VerificationToken');
});

// Controllers
container.register('usersController', function() {
    return require('../../app/controllers/users');
});
container.register('verificationController', function () {
    return require('../../app/controllers/verification');
});
container.register('placesController', function() {
    return require('../../app/controllers/places');
});

// Models
container.register('Place', function() {
    return require('../../app/models/place');
});

container.register('auth', require('../middlewares/authorization'));
container.register('mailer', require('../../app/controllers/mailer'));
container.register('globals', require('../globals'));
container.register('errorHandler',
    require('../../app/helpers/error-handlers'));
container.register('urlHelper', require('../../app/helpers/url'));

if (process.env.NODE_ENV === 'test') {
    require('./test.js')(container);
}

module.exports = container;
