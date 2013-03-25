/**
 * Policy for enforcing login
 */

var Exception401 = require('../exceptions/401');

module.exports = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	throw new Exception401("Unauthorized");
};