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

module.exports = function communityInit(app) {
	app.resource('community', controller, {
		middleware: {
			"*": loginRequired
		}
	});
	return model(app);
};