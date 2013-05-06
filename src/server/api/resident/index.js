/** Component: Resident
 * The Resident component is an Express.JS capable middleware which
 * encapsulates everything related to the Resident domain object.
 */
var controller = require('./controller')
	, model = require('./model')
	, URL_PREFIX = '/resident'

/** Function: residentInit
 * Initializes Resident URLs
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *
 * Returns:
 *   (Function) function to initialize relationships after creating all models.
 *
module.exports = function residentInit(app) {

	/**
	 * /community/:slug/resident POST -- create
	 *		/new GET -- fresh
	 *		/:id GET/PUT/DELETE
	 *

	app.post(RESIDENT_PREFIX, controller.create);

	app.get(RESIDENT_PREFIX + "/new", controller.fresh);

	return model(app);
};*/

module.exports = function initResidentApi(api) {
	api.get(URL_PREFIX + '/:facebookid', controller.getResidentWithFacebookId);
};