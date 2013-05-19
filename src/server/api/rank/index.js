/** Component: Rank
 * The Rank component is an Express.JS capable middleware which
 * encapsulates everything related to the Rank domain object.
 *
 * API Routes:
 *     GET community/:slug/rank - Returns the ranking of the named url
 *                                parameters :slug
 */

 var controller = require('./controller')
	, basicAuthentication = require('../policy/basicAuthentication')
	, authorizedForCommunity = require('../policy/authorizedForCommunity')
	, path = require('path')
	, modulePrefix = '/community/:slug/rank';

module.exports = function initRankApi(api, apiPrefix) {
	var prefix = path.join(apiPrefix, modulePrefix);

	api.get(prefix, [
		basicAuthentication
		, authorizedForCommunity
		, controller.index]);
};