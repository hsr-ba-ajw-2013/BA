var expressWinston = require('express-winston'),
	winston = require('winston');

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