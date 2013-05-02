/** Module: Handler
 * Using the express.js/connect <error handler at
 * http://www.senchalabs.org/connect/middleware-errorHandler.html>, this
 * middleware will display error pages if there has been an error/exception.
 */

var express = require('express')
	, path = require('path')
	, Exception401 = require(path.join('..', '..',
		'shared', 'exceptions', '401'));

/** PrivateFunction: handler401
 * 401 handler which will redirect to <Login.Controller> if it's a not-json
 * query.
 * If it's a json query, it will simply return a 401 http status response.
 *
 * Parameters:
 *   (Object) err - Error
 *   (Request) req - Request
 *   (Response) res - Response
 *   (Function) next - Next request handler in chain
 */
function handler401(err, req, res, next) {
	if (err instanceof Exception401) {
		if(req.is('json')) {
			return res.send(401);
		}
		return res.redirect('/login');
	}
	next(err);
}

/** Function: handlerInit
 * Initialize error handlers
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *   (Object) config - Configuration
 */
module.exports = function handlerInit(app) {
	app.use(handler401);

	app.configure('development', function developmentEnvironment() {
		app.use(express.errorHandler());
	});
};
