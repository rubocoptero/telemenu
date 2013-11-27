var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	root: rootPath,
	port: process.env.PORT || 3000,
    // mongodb in localhost from production.json to avoid overwrite.
    db: process.env.MONGOHQ_URL || 'mongodb://localhost/mean'
}
