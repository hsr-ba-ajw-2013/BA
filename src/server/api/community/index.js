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
	, taskValidators = require('../task/validators')
	, path = require('path')
	, utils = require('../utils')
	, modulePrefix = '/community';

module.exports = function initCommunityApi(api, apiPrefix) {
	var prefix = path.join(apiPrefix, modulePrefix);

	// GET /apu/community/:id
	api.get(path.join(prefix, ':id(\\d+)'), [
		basicAuthentication
		, authorizedForCommunity
		, controller.getCommunityWithId]);

	// GET /api/community/:slug
	api.get(path.join(prefix, ':slug'), [
		basicAuthentication
		, authorizedForCommunity
		, controller.getCommunityWithSlug]);

	// GET /api/community/:slug/tasks
	api.get(path.join(prefix, ':slug', 'tasks'), [
		basicAuthentication
		, authorizedForCommunity
		, controller.getTasksForCommunityWithSlug]);

	// POST /api/community
	api.post(prefix, [
		basicAuthentication
		, communityValidators.createCommunity
		, controller.createCommunity
		]);

	// POST /community
	api.app.post(modulePrefix, utils.buildFormRoute(
		'success', 'error', api, [
			communityValidators.createCommunity
			, controller.createCommunity
		]));

	// POST /api/community/:slug/tasks
	api.post(path.join(prefix, ':slug', 'tasks'), [
		basicAuthentication
		, authorizedForCommunity
		, taskValidators.createTask
		, controller.createTaskForCommunityWithSlug
		]);
};