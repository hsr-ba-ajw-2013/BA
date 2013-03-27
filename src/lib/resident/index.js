/** Component: Resident
 */
var controller = require('./controller')
	, model = require('./model')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	);

// inject express-resource-middleware into app
require('express-resource-middleware');

module.exports = function residentInit(app) {
	app.resource('resident', controller, {
		middleware: {
			"*": loginRequired
		}
	});

	return model(app);
};