/**
 * Policy for enforcing login
 */

var Exception401 = require('../exceptions/401');

module.exports = function loginRequired(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	req.session.redirectUrl = req.url;

	return next(new Exception401("Unauthorized"));
};