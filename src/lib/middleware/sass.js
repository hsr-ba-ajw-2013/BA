"use strict";

var sass = require('node-sass'),
	path = require('path');

module.exports = function(app, config) {
	// FIXME: __dirname
	app.use(sass.middleware({
		src: __dirname
		, dest: path.join(config.srcDir, 'public')
		, debug: true
	}));
};
