/**
 * Policy for enforcing login
 */

module.exports = function(req, res, next) {
	if (req.user !== undefined) {
		return next();
	}
	res.send(401);
}