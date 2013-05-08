/** Module: API
 */
var _ = require('underscore')
	, setupResidentApi = require('./resident');



function initApi(api) {
	setupResidentApi(api);
}

module.exports = initApi;