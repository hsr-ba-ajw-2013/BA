var controller = require('./controller')
	, model = require('./model')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	);

// inject express-resource into app
require('express-resource');

module.exports = function(app) {
	app.all('/resident*', loginRequired);
	app.resource('resident', controller);

	return model(app);
};