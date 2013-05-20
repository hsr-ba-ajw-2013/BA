/** Component: Api.Rank
 * The Rank API component sets up the APIAdapter to interact with ranking
 * related domain objects.
 *
 * API Routes:
 *     GET community/:slug/rank - Returns the ranking list for the community
 *                                with slug :slug
 */

var controller = require('./controller')
	, communityTransporter = require('../community/transporter')
	, basicAuthentication = require('../policy/basicAuthentication')
	, authorizedForCommunity = require('../policy/authorizedForCommunity')
	, path = require('path')
	, modulePrefix = '/community/:slug/rank';

module.exports = function initRankApi(api, apiPrefix) {
	var prefix = path.join(apiPrefix, modulePrefix);

	api.get(prefix, [
		basicAuthentication
		, authorizedForCommunity
		, communityTransporter
		, controller.getRankingListForCommunity]);
};