
var errorCodes = {
    duplicateKey: 11000
};

var getDuplicationErrorMessage = function(err) {
    var duplicatedValue = err.err.split('"')[1];
    return duplicatedValue + ' ya existe';
};

exports.forMongoose = function(err) {
    return getDuplicationErrorMessage(err);
};
