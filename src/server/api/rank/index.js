/** Component: Api.Rank
 * The Rank API component sets up the APIAdapter to interact with ranking
 * related domain objects.
 *
 * API Routes:
 *     GET community/:slug/ranks - Returns the ranking list for the community
 *                                with slug :slug
 */

var controller = require('./controller')
	, basicAuthentication = require('../policy/basicAuthentication')
	, authorizedForCommunity = require('../policy/authorizedForCommunity')
	, path = require('path')
	, modulePrefix = '/community/:slug/ranks';

module.exports = function initRankApi(api, apiPrefix) {
	var prefix = path.join(apiPrefix, modulePrefix);

	// GET /api/community/:slug/ranks
	api.get(prefix, [
		basicAuthentication
		, authorizedForCommunity
		, controller.getRankingListForCommunity]);
};