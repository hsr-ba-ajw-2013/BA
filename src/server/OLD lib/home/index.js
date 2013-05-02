/** Component: Home
 * The Community component is an Express.JS capable middleware which
 * encapsulates urls to the homepage and inviting.
 */
var controller = require('./controller')
	, path = require('path')
	, communityTransporter = require(path.join('..', 'community','transporter'))
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	);

/** Function: homeInit
 * Initializes Home urls (/ and /invite/:sharelink).
 *
 * Parameters:
 *   (express.application) app - Initialized express application
 */
module.exports = function homeInit(app) {
	/**
	 * / (GET)
	 * * /invite/RANDOM (GET -> REDIRECT TO /community/:slug/resident/new)
	 */

	app.get('/', loginRequired, communityTransporter, controller.index);
	app.get('/invite/:sharelink', loginRequired, controller.invite);
};