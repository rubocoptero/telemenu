var sharedConfig = require('./karma-shared.conf');
var paths = require('../paths.js');

module.exports = function(config) {
    var conf = sharedConfig();

    conf.files = conf.files.concat([
        //extra testing code
        paths.lib + 'angular-mocks/angular-mocks.js',

        //mocha stuff
        paths.publicTests + 'mocha.conf.js',

        //test files
        paths.publicTests + 'unit/**/*.js'
    ]);

    config.set(conf);
};
