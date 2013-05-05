/** Module: HTTP
 * The HTTP middleware sets up a few default middlewares to an Express.JS app:
 * * <bodyParser at http://expressjs.com/api.html#bodyParser> to ensure that
 *   request payload is injected into the request object
 * * <cookieParser at http://expressjs.com/api.html#cookieParser> to parse
 *   cookies
 * * <session at http://www.senchalabs.org/connect/middleware-session.html>
 *   and <SequelizeStore at
 *   https://github.com/mweibel/connect-session-sequelize> for session handling
 * * <methodOverride at
 *   http://www.senchalabs.org/connect/middleware-methodOverride.html> for faux
 *   HTTP method support
 */

var express = require('express')
	, SequelizeStore = require('connect-session-sequelize')(express);

/** Function: setupHttp
 * Adds described middlewares to the passed Express.JS application
 *
 * Parameters:
 *   (Object) app - Express.JS application
 *   (Object) config - Configuration
 */
function setupHttp(app, config) {
	var db = app.get('db');

	app.use(express.bodyParser());
	app.use(express.cookieParser());

	app.use(express.session({
		store: new SequelizeStore({
			db: db
		})
		, secret: config.sessionSecret
	}));

	app.use(express.methodOverride());
}

module.exports = setupHttp;