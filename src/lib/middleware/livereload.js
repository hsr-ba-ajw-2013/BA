var livereload = require('express-livereload');

module.exports = function livereloadInit(app, config) {
	var livereloadConfig = config.livereload || {};
	livereloadConfig.watchDir = config.srcDir;
	livereload(app, config=livereloadConfig);
};