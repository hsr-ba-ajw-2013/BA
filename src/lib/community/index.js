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

// inject express-resource into app
require('express-resource');

module.exports = function communityInit(app) {
	app.all('/community*', loginRequired);
	app.resource('community', controller);
	return model(app);
};