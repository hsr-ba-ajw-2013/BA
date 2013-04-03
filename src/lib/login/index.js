/** Component: Login
 */
var controller = require('./controller')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	);


module.exports = function loginInit(app) {
	app.get('/login', controller.login);
	app.get('/logout', loginRequired, controller.logout);
};