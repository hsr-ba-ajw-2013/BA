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
module.exports = function middleware(app, config) {
	connectDomain(app, config);

	expressStatic(app, config);

	db(app, config);

	i18n(app, config);
	browserify(app, config);
	navigation(app, config);
	http(app, config);
	flash(app, config);
	view(app, config);

	passport(app, config);

	handler(app, config);
	logger(app, config);

	router(app, config);

	clientConfig(app, config);

	livereload(app, config);
};