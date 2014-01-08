var urlHelper = require('../../../app/helpers/url');

describe('<Unit Test>', function() {
    describe('URL Helpers:', function() {
        it('should receive a url and no params and build the final url',
            function() {
                var finalUrl = urlHelper.buildUrlWithParams('/path', {});

                finalUrl.should.be.equal('/path');
            });

        it('should receive a url and a param and build the final url',
            function() {
                var finalUrl = urlHelper.buildUrlWithParams(
                    '/path',
                    {
                        paramName: 'paramValue'
                    }
                );

                finalUrl.should.be.equal('/path?paramName=paramValue');
            });

        it('should receive a url and two params and build the final url',
            function() {
                var finalUrl = urlHelper.buildUrlWithParams(
                    '/path',
                    {
                        first: '1',
                        second: '2',
                    }
                );

                finalUrl.should.be.equal('/path?first=1&second=2');
            });
    });
});
