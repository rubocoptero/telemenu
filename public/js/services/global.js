window.angular.module('telemenu.system').factory('Global', function() {
    var _this = this;
    _this._data = {
        user: window.user,
        verified: (window.user? window.user.verified : null),
        authenticated: !! window.user
    };

    return _this._data;
});
