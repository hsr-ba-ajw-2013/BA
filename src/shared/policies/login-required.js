/**
 * Policy for enforcing login
 */
"use strict";

module.exports = function(req, res, next) {
	console.log(req.user);
	if (req.user !== undefined) {
		return next();
	}
	res.send(401);
}