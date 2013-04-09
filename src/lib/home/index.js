/** Component: Home
 */
var controller = require('./controller')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	);


module.exports = function homeInit(app) {
	/**
	 * / (GET)
	 * * /invite/RANDOM (GET -> REDIRECT TO /community/:slug/resident/new)
	 */

	app.get('/', loginRequired, controller.index);
	app.get('/invite/:sharelink', loginRequired, controller.invite);
};