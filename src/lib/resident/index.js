/** Component: Resident
 * The Resident component is an Express.JS capable middleware which
 * encapsulates everything related to the Resident domain object.
 */
var controller = require('./controller')
	, model = require('./model')
	, PREFIX = '/community/:slug/resident';

module.exports = function residentInit(app) {

	app.get(PREFIX + "/new", controller.fresh);

	return model(app);
};