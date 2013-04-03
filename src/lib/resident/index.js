/** Component: Resident
 */
var controller = require('./controller')
	, model = require('./model')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	);

module.exports = function residentInit(app) {
	//FIXME: INYAFACE JSHINT
	controller = controller;
	loginRequired = loginRequired;
	return model(app);
};