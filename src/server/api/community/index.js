/** Component: Api.Community
 * The Community API component sets up the APIAdapter to interact with community
 * related domain objects.
 *
 * API Routes:
 *     GET community/:slug - Returns the community with the named url parameters
 *                           :slug.
 *     GET community/:slug/tasks - Returns all tasks which belong to the
 *                                 community with the named url parameter :slug.
 *     GET community/:id - Returns a community from the specified id
 *     POST community/ - Creates a new community based upon the information
 *                       passed with the function call.
 *     DELETE community/:slug - Marks a community as deleted
 *     GET join/community/:shareLink - Joins the specified community
 *
 * Form Routes:
 *     POST /community/:slug/resident - Joins a community
 *     POST /community - Create a community
 *     DELETE /community/:slug - Deletes a community
 *
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

	// DELETE /api/community/:slug
	api.del(prefix, [
		basicAuthentication
		, controller.deleteCommunity]);

	// GET /api/join/community/:shareLink
	api.get(apiPrefix + '/join' + modulePrefix + '/:shareLink', [
			basicAuthentication
			, controller.getCommunityWithShareLink
	]);

	// POST /community/:slug/resident
	// there's no /api-prefixed version of this url
	api.app.post(modulePrefix + '/:slug/resident', utils.buildFormRoute(
		function success(community, redirect) {
			redirect('/community/' + community.slug + '/tasks');
		}
		, function error(err, redirect) {
			api.app.get('eventbus').emit('validation:error', err.message);
			redirect('/community/create');
		}
		, api, [
		basicAuthentication
		, controller.joinCommunity
	]));

	// POST /community
	// This makes the createCommunity API function accessible for old-school
	// form submits
	api.app.post(modulePrefix, utils.buildFormRoute(
		function success(community, redirect) {
			redirect('/community/' + community.slug + '/tasks');
		}
		, function error(err, redirect) {
			api.app.get('eventbus').emit('validation:error', err.message);
			redirect('/community/create');
		}
		, api
		, [
			basicAuthentication
			, communityValidators.createCommunity
			, controller.createCommunity
		]
	));

	// DELETE /community/:slug
	// This makes the deleteCommunity API function accessible for old-school
	// form submits
	api.app.del(modulePrefix, utils.buildFormRoute(
		function success(community, redirect) {
			redirect('/');
		}
		, function error(community, redirect) {
			redirect('/');
		}
		, api
		, [
			basicAuthentication
			, controller.deleteCommunity
		]
	));
};