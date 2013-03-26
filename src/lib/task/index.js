/** Component: Task
 */
var controller = require('./controller')
	, model = require('./model')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	);

// inject express-resource into app
require('express-resource');

module.exports = function(app) {
	app.all('/task*', loginRequired);
	app.resource('task', controller);

	return model(app);
};