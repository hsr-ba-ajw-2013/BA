var livereload = require('express-livereload');

module.exports = function(app, config) {
	var livereloadConfig = config.livereload || {};
	livereload(app, config=livereloadConfig);
};