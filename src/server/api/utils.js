/** Class: Api.Utils
 * Contains utility functions for the REST API component.
 */
var errors = require('./errors')
	, crypto = require('crypto');

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

/** Function: randomString
 * Generates a random string using
 * <crypto at http://nodejs.org/api/crypto.html>.
 *
 * Parameters:
 *   (Integer) length - [Optional, default: 12] Length of the generated
 *                                              random string.
 *
 * Returns:
 *   (String) - random string
 */
function randomString(length) {
	length = length || 12;
	return crypto.pseudoRandomBytes(length).toString('hex').substr(0, length);
}

module.exports = {
	checkPermissionToAccess: checkPermissionToAccess
	, randomString: randomString
};