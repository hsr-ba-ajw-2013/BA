/** Component: Resident
 * The Resident component is an Express.JS capable middleware which
 * encapsulates everything related to the Resident domain object.
 */
var controller = require('./controller')
	, model = require('./model')
	, COMMUNITY_PREFIX = '/community/:slug'
	, RESIDENT_PREFIX = COMMUNITY_PREFIX + '/resident';

module.exports = function residentInit(app) {

	/**
	 * /community/:slug/resident POST -- create
	 *		/new GET -- fresh
	 *		/:id GET/PUT/DELETE
	 */

	app.post(RESIDENT_PREFIX, controller.create);

	app.get(RESIDENT_PREFIX + "/new", controller.fresh);

	return model(app);
};