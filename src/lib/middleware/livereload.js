"use strict";

var livereload = require('express-livereload');

module.exports = function(app, config) {
	// livereload
	var livereloadConfig = config.livereload || {};
	livereload(app, config=livereloadConfig);
}