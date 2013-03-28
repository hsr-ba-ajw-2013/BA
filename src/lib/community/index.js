/** Component: Community
 * The Community component is an Express.JS capable middleware which
 * encapsulates everything related to the Community domain object.
 */
var controller = require('./controller')
	, model = require('./model')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	);

// inject express-resource-middleware into app
require('express-resource-middleware');

/** Function: communityInit
 * Initializes the community component by adding
 * the controller to the available resources.
 *
 * Uses: express-resource-middleware
 *
 * Parameters:
 *   (express.application) app - Initialized express application
 *
 * Returns:
 *   (Function) function to initialize relationships after creating all models.
 */
module.exports = function communityInit(app) {
	app.resource('community', controller, {
		middleware: {
			"*": loginRequired
		}
	});
	return model(app);
};