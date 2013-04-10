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
	, templateData = require('./template-data')
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
	expressStatic(app, config);

	i18n(app, config);

	templateData(app, config);
	view(app, config);
	logger(app, config);

	//TODO: csrf

	db(app, config);

	http(app, config);

	flash(app, config);
	validator(app, config);

	passport(app, config);

	browserify(app, config);

	// important: the whole application doesn't work
	// if connect-domain is in front of http.
	connectDomain(app, config);

	handler(app, config);


	clientConfig(app, config);

	livereload(app, config);

	router(app, config);
};