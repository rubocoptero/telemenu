
module.exports = function (container) {
    // Third party test dependencies
    container.register('passportStub', require('passport-stub'));
    container.register('fixturesLoader', require('pow-mongoose-fixtures'));

    // Fixtures
    container.register('fixtures', function() {
        return require('../../test/server/fixtures/fixtures');
    });

    // Test specific dependencies
    container.register('TestUser', function() {
        return require('../../test/server/fixtures/test-user');
    });
    container.register('TestPlace', function() {
        return require('../../test/server/fixtures/test-place');
    });
    container.register('dbTestUtil', function() {
        return require('../../test/server/utils/db');
    });
    container.register('fsTestUtil', function() {
        return require('../../test/server/utils/fs');
    });
    container.register('consoleUtil',
        require('../../test/server/utils/console'));
    container.register('imageFixture', function() {
        return require('../../test/server/fixtures/image');
    });
};
