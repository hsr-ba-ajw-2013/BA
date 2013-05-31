/** Component: Api.Community
 * The Community API component sets up the APIAdapter to interact with community
 * related domain objects.
 *
 * API Routes:
 *     GET community/:slug - Returns the community with the named url parameters
 *                           :slug.
 *     GET community/:slug/tasks - Returns all tasks which belong to the
 *                                 community with the named url parameter :slug.
 *     POST community/ - Creates a new community based upon the information
 *                       passed with the function call.
 */

var controller = require('./controller')
	, basicAuthentication = require('../policy/basicAuthentication')
	, authorizedForCommunity = require('../policy/authorizedForCommunity')
	, communityValidators = require('./validators')
	, utils = require('../utils')
	, modulePrefix = '/community';

module.exports = function initCommunityApi(api, apiPrefix) {
	var prefix = apiPrefix + modulePrefix;

	// GET /api/community/:id
	api.get(prefix + '/:id(\\d+)', [
		basicAuthentication
		, authorizedForCommunity
		, controller.getCommunityWithId]);

	// GET /api/community/:slug
	api.get(prefix + '/:slug', [
		basicAuthentication
		, authorizedForCommunity
		, controller.getCommunityWithSlug]);

	// POST /api/community
	api.post(prefix, [
		basicAuthentication
		, communityValidators.createCommunity
		, controller.createCommunity
	]);

	// POST /community
	api.app.post(modulePrefix, utils.buildFormRoute(
		'/community', '/community/create', api, [
			basicAuthentication
			, communityValidators.createCommunity
			, controller.createCommunity
	]));

	// GET /api/community/join/:shareLink
	api.get(apiPrefix + '/join' + modulePrefix + '/:shareLink', [
			basicAuthentication
			, controller.getCommunityWithShareLink
	]);

	// POST /community/:slug/resident
	// there's no /api-prefixed version of this url
	api.app.post(modulePrefix + '/:slug/resident', utils.buildFormRoute(
		'/community', '/community/create', api, [
			basicAuthentication
			, controller.joinCommunity
	]));

	// DELETE /api/community/:slug
	api.del(prefix, [
		basicAuthentication
		, controller.deleteCommunity]);

	// DELETE /community/:slug
	api.app.del(modulePrefix, utils.buildFormRoute(
		'/', '/', api, [
		basicAuthentication
		, controller.deleteCommunity
	]));
};