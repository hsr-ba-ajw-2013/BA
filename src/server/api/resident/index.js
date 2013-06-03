/** Component: Api.Resident
 * The Resident component is an Express.JS capable middleware which
 * encapsulates everything related to the Resident domain object.
 *
 * API Routes
 *		GET resident/:facebookid - Return the resident with the
 *									named url parameters
 *		GET resident/:facebookid/profile - Return the profile of the resident
 *                                         with the named url parameters
 */
var controller = require('./controller')
	, basicAuthentication = require('../policy/basicAuthentication')
	, path = require('path')
	, modulePrefix = 'resident';

module.exports = function initResidentApi(api, apiPrefix) {
	var prefix = path.join(apiPrefix, modulePrefix);

	// GET /api/resident/:facebookid
	api.get(path.join(prefix, ':facebookid'), [
		basicAuthentication
		, controller.getResidentWithFacebookId
	]);

	// GET /api/resident/:facebookid/profile
	api.get(path.join(prefix, ':facebookid', 'profile'), [
		basicAuthentication
		, controller.getProfileWithFacebookId
	]);
};