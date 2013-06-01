/** Policy: Api.Policy.BasicAuthentication
 * This is the simplest of all possible security policies. It checks the
 * the isAuthenticated flag in the request object which is usally set by the
 * authentication middleware
 *
 * If the current request is authenticated correctly, the api call will proceed,
 * otherwise a <NotAuthorizedError> will be created and returned.
 */
var errors = require('../errors')
	, debug = require('debug')('roomies:api:policy:' +
								'basic-authentication');

/** Function: checkPermissionToAccess
 * Checks the isAuthenticated flag from the request object.
 *
 * If authenticated, succes is called to signal that the API request can be
 * processed further. If not authenticated, error is called, passing a
 * <NotAuthorizedError> object.
 *
 * Parameter:
 *     (Function) success - Success callback
 *     (Function) error - Error callback
 */
function checkPermissionToAccess(success, error) {
	debug('check permission to access');
	var authenticated = this.req.isAuthenticated();

	if(authenticated) {
		debug('...ok');
		success();
	} else {
		debug('...error');
		error(new errors.NotAuthorizedError('Not Authorized!'));
	}
}

module.exports = checkPermissionToAccess;