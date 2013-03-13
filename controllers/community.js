/**
 * Community Controller
 */

var PREFIX = '/community';

var loginRequired = require('../policies/login-required');

module.exports = function(app) {
	app.all(PREFIX + '*', loginRequired);
	app.get(PREFIX + '/', index);;
}

var index = function(req, res) {
	res.send(200);
};