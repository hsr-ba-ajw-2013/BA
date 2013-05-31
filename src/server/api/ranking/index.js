/** Component: Api.Ranking
 * The Ranking API component sets up the APIAdapter to interact with ranking
 * related domain objects.
 *
 * API Routes:
 *     GET community/:slug/rankings - Returns the ranking list for the community
 *                                    with slug :slug
 */

var controller = require('./controller')
	, basicAuthentication = require('../policy/basicAuthentication')
	, authorizedForCommunity = require('../policy/authorizedForCommunity')
	, path = require('path')
	, modulePrefix = '/community/:slug/rankings';

module.exports = function initRankingApi(api, apiPrefix) {
	var prefix = path.join(apiPrefix, modulePrefix);

	// GET /api/community/:slug/rankings
	api.get(prefix, [
		basicAuthentication
		, authorizedForCommunity
		, controller.getRankingListForCommunity]);
};