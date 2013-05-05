/** Module: Middleware
 * Initializes all middlewares
 */

var	//, clientConfig = require('./client-config')
	connectDomain = require('./connect-domain')
	, db = require('./db')
	//, flash = require('./flash')
	//, handler = require('./handler')
	, http = require('./http')
	, locale = require('./locale')
	//, i18n = require('./i18n')
	//, livereload = require('./livereload')
	, logger = require('./logger')
	//, templateData = require('./template-data')
	, auth = require('./auth')
	//, router = require('./router')
	, expressStatic = require('./static')
	//, validator = require('./validator')
	//, view = require('./view');
	;

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
	expressStatic(app, config);
	//i18n(app, config);
	//templateData(app, config);
	//view(app, config);
	logger(app, config);
	//TODO: csrf
	db(app, config);
	http(app, config);
	locale(app, config);
	//flash(app, config);
	//validator(app, config);
	auth(app, config);
	// important: the whole application doesn't work
	// if connect-domain is in front of http.
	connectDomain(app, config);
	//handler(app, config);
	//clientConfig(app, config);
	//livereload(app, config);
	//router(app, config);
}

module.exports = setupMiddleware;