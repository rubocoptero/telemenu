var paths = require('../paths.js');

module.exports = function() {
    return {
        basePath: '../../../',
        frameworks: ['mocha'],
        reporters: ['progress'],
        browsers: ['Chrome'],
        autoWatch: true,

        // these are default values anyway
        singleRun: false,
        colors: true,

        files : [
            //3rd Party Code
            paths.lib + 'angular/angular.js',
            paths.lib + 'angular-route/angular-route.js',
            paths.lib + 'angularjs-scope.safeapply/src/Scope.SafeApply.js',
            //'app/scripts/lib/router.js',

            //App-specific Code
            paths.lib + 'config/config.js',
            paths.lib + 'services/**/*.js',
            paths.lib + 'directives/**/*.js',
            paths.lib + 'controllers/**/*.js',
            paths.lib + 'filters/**/*.js',
            paths.lib + 'config/routes.js',
            paths.lib + 'app.js',

            //Test-Specific Code
            paths.lib + 'chai/chai.js',
            paths.publicTests + 'lib/chai-should.js',
            paths.publicTests + 'lib/chai-expect.js'
        ]
    };
};
