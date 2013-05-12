/** Class: Api.Utils
 * Contains utility functions for the REST API component.
 */
var errors = require('./errors');

/** Function: checkPermissionToAccess
 * Checks if a given request is authenticated. If not, an NotAuthorizedError is
 * thrown.
 *
 * Paremters:
 *     (Object) req -  An Express.JS request object
 *
 * Returns:
 *     (Boolean)
 */
function checkPermissionToAccess(req) {
	var authenticated = req.isAuthenticated();

	if(!authenticated) {
		throw new errors.NotAuthorizedError('Not Authorized!');
	}

	return true;
}

module.exports = {
	checkPermissionToAccess: checkPermissionToAccess
}