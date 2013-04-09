/** Component: Resident
 * The Resident component is an Express.JS capable middleware which
 * encapsulates everything related to the Resident domain object.
 */
var controller = require('./controller')
	, model = require('./model')
	, PREFIX = '/community/:slug/resident';

module.exports = function residentInit(app) {

	/**
	 * /community/:slug/resident POST -- create
	 *		/new GET -- fresh
	 *		/:id GET/PUT/DELETE
	 */

	app.post(PREFIX, controller.create);

	app.get(PREFIX + "/new", controller.fresh);

	return model(app);
};