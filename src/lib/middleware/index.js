"use strict";

var browserify = require('./browserify')
	, clientConfig = require('./client-config')
	, connectDomain = require('./connect-domain')
	, db = require('./db')
	, flash = require('./flash')
	, handler = require('./handler')
	, http = require('./http')
	, i18n = require('./i18n')
	, livereload = require('./livereload')
	, logger = require('./logger')
	, navigation = require('./navigation')
	, passport = require('./passport')
	, router = require('./router')
	, expressStatic = require('./static')
	, validator = require('./validator')
	, view = require('./view');

/** Function: middleware
 * Calls the required middlewares
 *
 * Beware: The Ordering of middlewares is very important.
 *         Don't reorder if you don't know what you're doing.
 *
 * Parameters:
 *   (Express.App) app - Express Application
 *   (Object) config - Configuration
 */
module.exports = function middlewareInit(app, config) {
	i18n(app, config);

	view(app, config);
	logger(app, config);

	//TODO: csrf

	http(app, config);

	db(app, config);

	browserify(app, config);
	navigation(app, config);

	// important: the whole application doesn't work
	// if connect-domain is in front of http.
	connectDomain(app, config);

	validator(app, config);

	flash(app, config);

	passport(app, config);
	handler(app, config);


	clientConfig(app, config);

	livereload(app, config);

	router(app, config);
	expressStatic(app, config);
};