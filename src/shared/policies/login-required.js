/**
 * Policy for enforcing login
 */
"use strict";

module.exports = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.send(401);
}