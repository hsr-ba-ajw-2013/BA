/** Module: Logger
 * Logs requests & errors if enabled.
 *
 * Uses:
 *   - <winston at https://github.com/flatiron/winston>
 *   - <express-winston at https://github.com/firebaseco/express-winston>
 */

var expressWinston = require('express-winston'),
	winston = require('winston');

/** Function: loggerInit
 * Initializes logging
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *   (Object) config - Configuration
 */
module.exports = function loggerInit(app, config) {
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

	// request logging
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
};