"use strict";

var express = require('express'),
	path = require('path');

module.exports = function(app, config) {
	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, '..'));

	app.set('layout', path.join(config.srcDir, 'shared', 'layouts', 'default.ejs'));

	app.use(express.favicon(path.join(config.srcDir, 'public', 'images', 'favicon.ico'), {
		// 30 days
		maxAge: 2592000000
	}));
};