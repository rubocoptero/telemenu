var auth = require('../../../../config/middlewares/authorization');

describe('Authorization Middleware:', function() {
    it('should redirect to login when a user is not authenticated', function() {
        var req = {
            isAuthenticated: function() { return false; },
            path: '/current/url'
        };
        var res = {
            locals: {},
            redirect: sinon.spy()
        };
        var nextSpy = sinon.spy();

        auth.haveToLogin(req, res, nextSpy);

        res.redirect.should.be.calledOnce;
        res.redirect.should.be.calledWith('/signin?afterGoTo=' + req.path);
        nextSpy.should.be.notCalled;
    });
});
