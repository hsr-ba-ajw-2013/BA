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
	, setupResidentApi = require('./resident')
	, setupCommunityApi = require('./community');

function initApi(api) {
	setupResidentApi(api, apiPrefix);
	setupCommunityApi(api, apiPrefix);
}

module.exports = initApi;