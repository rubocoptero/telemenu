global.appContainer.resolve(function (fsTestUtil) {
    var path = require('path');
    var originalImage = path.resolve(__dirname, './image.jpg');

    module.exports.getPath = function() {
        return fsTestUtil.getCopyPathOf(originalImage);
    };
});

