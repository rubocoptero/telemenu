var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

var requiredEnvVariable = function(name) {
    if (!process.env[name]) {
        throw new Error('Set the env variable "' + name + '"');
    }
    return process.env[name];
};

module.exports = {
	root: rootPath,
	port: process.env.PORT || 3000,
    // mongodb in localhost from production.json to avoid overwrite.
    db: process.env.MONGOHQ_URL || 'mongodb://localhost/mean',
    'facebook': {
        'clientID': requiredEnvVariable('FB_ID'),
        'clientSecret': requiredEnvVariable('FB_SECRET'),
        'callbackURL': 'http://' + requiredEnvVariable('URL_HOST') +
            '/auth/facebook/callback'
    },
    'twitter': {
        'clientID': 'CONSUMER_KEY',
        'clientSecret': 'CONSUMER_SECRET',
        'callbackURL': 'http://localhost:3000/auth/twitter/callback'
    },
    'github': {
        'clientID': 'APP_ID',
        'clientSecret': 'APP_SECRET',
        'callbackURL': 'http://localhost:3000/auth/github/callback'
    },
    'google': {
        'clientID': 'APP_ID',
        'clientSecret': 'APP_SECRET',
        'callbackURL': 'http://localhost:3000/auth/google/callback'
    }
}
