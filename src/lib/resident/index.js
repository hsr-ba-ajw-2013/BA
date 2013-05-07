/** Component: Resident
 * The Resident component is an Express.JS capable middleware which
 * encapsulates everything related to the Resident domain object.
 */
var controller = require('./controller')
	, model = require('./model')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	)
	, communityTransporter = require(path.join('..', 'community','transporter'))
	, COMMUNITY_PREFIX = '/community/:slug'
	, RESIDENT_PREFIX = COMMUNITY_PREFIX + '/resident'
	, PROFILE_PREFIX = '/profile';

/** Function: residentInit
 * Initializes Resident URLs
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *
 * Returns:
 *   (Function) function to initialize relationships after creating all models.
 */
module.exports = function residentInit(app) {

	/**
	 * /community/:slug/resident POST -- create
	 *		/new GET -- fresh
	 *		/:id GET/PUT/DELETE
	 */

	app.post(RESIDENT_PREFIX, controller.create);

	app.get(RESIDENT_PREFIX + "/new", controller.fresh);


	app.all(PROFILE_PREFIX + '*', loginRequired, communityTransporter);
	app.get(PROFILE_PREFIX, controller.ownProfile);
	app.get(PROFILE_PREFIX + "/:id", controller.profile);

	return model(app);
};