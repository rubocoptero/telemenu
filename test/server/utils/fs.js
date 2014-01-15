var path = require('path'),
    fs = require('fs');

var getNameForCopy = function(sourcePath) {
    var extension = path.extname(sourcePath);
    var name = path.basename(sourcePath, extension);
    var dirname = path.dirname(sourcePath);

    return path.join(dirname, name.concat('-copy', extension));
};

var copy = function(src, dest) {
    var readable = fs.createReadStream(src);
    var writable = fs.createWriteStream(dest);

    readable.pipe(writable);
};

module.exports.getCopyPathOf = function(sourcePath) {
    var destinationPath = getNameForCopy(sourcePath);
    copy(sourcePath, destinationPath);
    return destinationPath;
};


