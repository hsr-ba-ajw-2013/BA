/** Component: Home
 */
var controller = require('./controller')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	);

// inject express-resource-middleware into app
require('express-resource-middleware');


module.exports = function homeInit(app) {
	app.resource(controller, {
		base: '/'
		, middleware: {
			"*": loginRequired
		}
	});
};