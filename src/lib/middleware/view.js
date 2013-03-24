"use strict";

var express = require('express')
	, path = require('path')
	, hbs = require('express-hbs');

module.exports = function(app, config) {
	app.engine('hbs', hbs.express3({
		partialsDir: path.join(config.srcDir, 'shared', 'partials')
		, layoutsDir: path.join(config.srcDir, 'shared', 'layouts')
		, defaultLayout: path.join(config.srcDir, 'shared', 'layouts', 'default.hbs')
	}));

	registerHelpers();

	app.set('view engine', 'hbs');
	app.set('views', path.join(__dirname, '..'));

	app.use(express.favicon(path.join(config.srcDir, 'public', 'images', 'favicon.ico'), {
		// 30 days
		maxAge: 2592000000
	}));
};

function registerHelpers() {
	hbs.registerHelper('stringify', function(item) {
		return JSON.stringify(item);
	});

	hbs.registerHelper('safestring', function(str) {
		return new hbs.SafeString(str);
	})
}