/** Module: Logger
 * Logs requests & errors if enabled.
 *
 * More information:
 * * <winston at https://github.com/flatiron/winston>
 * * <express-winston at https://github.com/firebaseco/express-winston>
 */

var expressWinston = require('express-winston')
	, winston = require('winston');

/** PrivateFunction: setupErrorLogging
 * Initializes a winston logger for the given Express.js app to log error
 * related messages.
 *
 * Parameters:
 *   (Object) app - Express.JS app to add the logger to
 *   (Object) config - Configuration
 */
function setupErrorLogging(app, config) {
	app.use(expressWinston.errorLogger({
		transports: [
			new winston.transports.Console({
				json: true
				, colorize: true
				, silent: config.logging.disableErrorLog
			})
		]
		, level: config.logging.errorLoglevel
	}));
}

/** PrivateFunction: setupRequestLogging
 * Initializes a winston logger for the given Express.js app to log requests.
 *
 * Parameters:
 *   (Object) app - Express.JS app to add the logger to
 *   (Object) config - Configuration
 */
function setupRequestLogging(app, config) {
	app.use(expressWinston.logger({
		transports: [
			new winston.transports.Console({
				json: true
				, colorize: true
				, silent: config.logging.disableRequestLog
			})
		]
		, level: config.logging.requestLoglevel
	}));
}

/** Function: loggerInit
 * Initializes the winston logger for the given Express.JS application using the
 * passed configuration options.
 *
 * Parameters:
 *   (Object) app - Express.JS app to add the logger to
 *   (Object) config - Configuration
 */
function setupLoggers(app, config) {
	setupErrorLogging(app, config);
	setupRequestLogging(app, config);
}

module.exports = setupLoggers;