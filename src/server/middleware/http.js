/** Module: HTTP
 * HTTP Middleware
 *
 * Handles:
 *   - parsing body using <bodyParser
 *                         at http://expressjs.com/api.html#bodyParser>
 *   - parsing cookies using <cookieParser
 *                             at http://expressjs.com/api.html#cookieParser>
 *   - session support using <session at
 *                 http://www.senchalabs.org/connect/middleware-session.html>
 *                 and <SequelizeStore at
 *                    https://github.com/mweibel/connect-session-sequelize>
 *   - faux HTTP method support using <methodOverride at
 *           http://www.senchalabs.org/connect/middleware-methodOverride.html>
 */

var express = require('express')
	, SequelizeStore = require('connect-session-sequelize')(express);

/** Function: httpInit
 * Initializes http middleware
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *   (Object) config - Configuration
 */
module.exports = function httpInit(app, config) {
	app.use(express.bodyParser());

	app.use(express.cookieParser());
	app.use(express.session({
		store: new SequelizeStore({
			db: app.get('db')
		})
		, secret: config.sessionSecret
	}));

	app.use(express.methodOverride());
};