/** Module: API
 */
var _ = require('underscore')
	, residentApi = require('./resident');



function initApi(api) {
	residentApi(api);
}

module.exports = initApi;