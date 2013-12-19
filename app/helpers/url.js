module.exports.buildUrlWithParams = function(url, params) {
    var queryString = '?';
    for (var param in params) {
        queryString += param + '=' + params[param] + '&';
    }
    return url + queryString.slice(0, -1);
};
