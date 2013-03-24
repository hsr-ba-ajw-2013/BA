"use strict";

var browserify = require('./browserify')
	, clientConfig = require('./client-config')
	, db = require('./db')
	, handler = require('./handler')
	, http = require('./http')
	, i18n = require('./i18n')
	, livereload = require('./livereload')
	, logger = require('./logger')
	, navigation = require('./navigation')
	, passport = require('./passport')
	, router = require('./router')
	, expressStatic = require('./static')
	, view = require('./view')
	, flash = require('./flash');

module.exports = function(app, config) {
	db(app, config);

	i18n(app, config);
	browserify(app, config);
	http(app, config);
	flash(app, config);
	passport(app, config);

	navigation(app, config);

	logger(app, config);
	handler(app, config);

	view(app, config);
	expressStatic(app, config);

	router(app, config);

	clientConfig(app, config);

	livereload(app, config);
};