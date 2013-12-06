var sharedConfig = require('./karma-shared.conf');
var paths = require('../paths.js');

module.exports = function(config) {
    var conf = sharedConfig();

    conf.files = conf.files.concat([
        //extra testing code
        paths.lib + 'ng-midway-tester/src/ngMidwayTester.js',

        //mocha stuff
        paths.publicTests + 'mocha.conf.js',

        //test files
        paths.publicTests + 'midway/appSpec.js',
        paths.publicTests + 'midway/controllers/controllersSpec.js',
        paths.publicTests + 'midway/filters/filtersSpec.js',
        paths.publicTests + 'midway/directives/directivesSpec.js',
        paths.publicTests + 'midway/requestsSpec.js',
        paths.publicTests + 'midway/routesSpec.js',
        paths.publicTests + 'midway/**/*.js'
    ]);

    conf.proxies = {
        '/': 'http://localhost:9999/'
    };

    config.set(conf);
};
