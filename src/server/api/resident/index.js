/** Component: Api.Resident
 * The Resident component is an Express.JS capable middleware which
 * encapsulates everything related to the Resident domain object.
 */
var controller = require('./controller')
	, basicAuthentication = require('../policy/basicAuthentication')
	, path = require('path')
	, modulePrefix = 'resident';


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

module.exports = function initResidentApi(api, apiPrefix) {
	var prefix = path.join(apiPrefix, modulePrefix);

	api.get(path.join(prefix, ':facebookid'), [
		basicAuthentication
		, controller.getResidentWithFacebookId
	]);
};