global.appContainer.resolve(function (auth) {
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

        it('should send a 401 when user is not verified', function() {
            var req = {
                user: {verified: false}
            };
            var res = {
                send: sinon.spy()
            };

            auth.requiresVerification(req, res, undefined);

            res.send.should.be.calledOnce;
            res.send.should.be.calledWith(401);
        });

        it('should call next middleware when user is verified', function() {
            var req = {
                user: {verified: true}
            };
            var nextSpy = sinon.spy();

            auth.requiresVerification(req, undefined, nextSpy);

            nextSpy.should.be.calledOnce;
        });

        it('should send a 403 when user is not the owner of the place',
            function() {
                var req = {
                    user: { id: 'ID' },
                    place: {user: {id: 'differentID'}}
                };
                var res = {
                    send: sinon.spy()
                };

                auth.place.hasAuthorization(req, res, undefined);

                res.send.should.be.calledOnce;
                res.send.should.be.calledWith(403);
            });

        it('should call next when user is the owner of the place',
            function() {
                var req = {
                    user: { id: 'sameID' },
                    place: {user: {id: 'sameID'}}
                };
                var nextSpy = sinon.spy();

                auth.place.hasAuthorization(req, undefined, nextSpy);

                nextSpy.should.be.calledOnce;
            });
    });
});
