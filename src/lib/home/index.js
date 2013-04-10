/** Component: Home
 */
var controller = require('./controller')
	, path = require('path')
	, communityTransporter = require(path.join('..', 'community','transporter'))
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	);


module.exports = function homeInit(app) {
	/**
	 * / (GET)
	 * * /invite/RANDOM (GET -> REDIRECT TO /community/:slug/resident/new)
	 */

	app.get('/', loginRequired, communityTransporter, controller.index);
	app.get('/invite/:sharelink', loginRequired, controller.invite);
};