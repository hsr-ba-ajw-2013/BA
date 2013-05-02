/** Component: Login
 *  Handles login and logout urls
 */
var controller = require('./controller')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	);

/** Function: loginInit
 * Initializes /login and /logout urls
 *
 * Parameters:
 *   (express.application) app - Initialized express application
 */
module.exports = function loginInit(app) {
	app.get('/login', controller.login);
	app.get('/logout', loginRequired, controller.logout);
};