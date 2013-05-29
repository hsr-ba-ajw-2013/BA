/** Component: Api
 * The API module contains the stateless REST API for Roomies. Its abstract
 * nature without any direct dependencies to the HTTP protocol via Express.JS
 * ensures that it can be adapted by Barefoots <APIAdapter at
 * http://swissmanu.github.io/barefoot/docs/files/lib/apiadapter-js.html>.
 *
 * Doing this, it is callable locally on the server but also over the network
 * using common HTTP REST calls.
 *
 * See also:
 * * <Barefoot.APIAdapter at
 *   http://swissmanu.github.io/barefoot/docs/files/lib/apiadapter-js.html>
 */
var apiPrefix = '/api'
	, setupCommunityApi = require('./community')
	, setupFlashMessagesApi = require('./flash-messages')
	, setupAchievements = require('./gamification')
	, setupTaskApi = require('./task')
	, setupRankApi = require('./rank')
	, setupResidentApi = require('./resident')
	, debug = require('debug')('roomies:api:index');

function initApi(api) {
	debug('init api');
	setupCommunityApi(api, apiPrefix);
	setupFlashMessagesApi(api, apiPrefix);
	setupAchievements(api, apiPrefix);
	setupTaskApi(api, apiPrefix);
	setupResidentApi(api, apiPrefix);
	setupRankApi(api, apiPrefix);
}

module.exports = initApi;