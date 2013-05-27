/** Module: Handler
 * Using the express.js/connect <error handler at
 * http://www.senchalabs.org/connect/middleware-errorHandler.html>, this
 * middleware will display error pages if there has been an error/exception.
 */

var express = require('express');

/** Function: handlerInit
 * Initialize error handlers
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *   (Object) config - Configuration
 */
module.exports = function handlerInit(app) {
	app.configure('development', function developmentEnvironment() {
		app.use(express.errorHandler());
	});
};
