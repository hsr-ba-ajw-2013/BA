/** Module: Middleware
 * Initializes all middlewares
 */

var	auth = require('./auth')
	, clientConfig = require('./client-config')
	, connectDomain = require('./connect-domain')
	, connectTimeout = require('./connect-timeout')
	, eventBus = require('./event-bus')
	, db = require('./db')
	, http = require('./http')
	, locale = require('./locale')
	, logger = require('./logger')
	, expressStatic = require('./static');

/** Function: setupMiddleware
 * Calls the required middlewares
 *
 * Beware:
 * The Ordering of middlewares is very important. Don't reorder if you don't
 * know what you're doing.
 *
 * Parameters:
 *     (Express) app - Express Application
 *     (Object) config - Configuration
 */
function setupMiddleware(app, config) {
	connectTimeout(app, config);
	expressStatic(app, config);

	logger(app, config);

	eventBus(app, config);

	db(app, config);
	http(app, config);
	locale(app, config);
	auth(app, config);

	// important: the whole application doesn't work
	// if connect-domain is in front of http.
	connectDomain(app, config);

	clientConfig(app, config);
}

module.exports = setupMiddleware;