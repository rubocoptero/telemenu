var sharedConfig = require('./karma-shared.conf');
var paths = require('../paths.js');

module.exports = function(config) {
    var conf = sharedConfig();

    conf.files = conf.files.concat([
        //test files
        paths.publicTests + '/e2e/**/*.js'
    ]);

    conf.proxies = {
        '/': 'http://localhost:9999/'
    };

    conf.urlRoot = '/__karma__/';

    conf.frameworks = ['ng-scenario'];

    config.set(conf);
};
