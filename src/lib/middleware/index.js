"use strict";

var browserify = require('./browserify')
	, clientConfig = require('./client-config')
	, db = require('./db')
	, handler = require('./handler')
	, http = require('./http')
	, i18n = require('./i18n')
	, layouts = require('./layouts')
	, livereload = require('./livereload')
	, logger = require('./logger')
	, passport = require('./passport')
	, router = require('./router')
	, expressStatic = require('./static')
	, view = require('./view');

module.exports = function(app, config) {
	db(app, config);


	view(app, config);
	i18n(app, config);
	layouts(app, config);
	browserify(app, config);
	http(app, config);
	passport(app, config);

	logger(app, config);
	handler(app, config);

	expressStatic(app, config);



	router(app, config);

	clientConfig(app, config);


	livereload(app, config);
};