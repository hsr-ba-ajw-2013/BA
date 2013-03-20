"use strict";

var browserify = require('browserify-middleware'),
	path = require('path');

module.exports = function(app, config) {
	app.use('/js', browserify(path.join(config.srcDir, 'public', 'javascripts')));
};