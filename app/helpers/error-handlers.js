
var errorCodes = {
    duplicateKey: 11000
};

var getDuplicationErrorMessage = function(err) {
    var duplicatedValue = err.err.split('"')[1];
    return duplicatedValue + ' ya existe';
};

var getValidationErrorMessage = function (err) {
    var messages = [];

    for (var error in err.errors) {
        messages.push(err.errors[error].message);
    }

    return messages.join('\n');
};

exports.forMongoose = function(err) {
    var message;
    if (err.name === 'ValidationError') {
        message = getValidationErrorMessage(err);
    } else if (err.name === 'MongoError') {
        message = getDuplicationErrorMessage(err);
    }
    return message;
};
