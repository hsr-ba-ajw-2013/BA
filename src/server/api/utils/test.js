/** Module: Api.Utils.Test
 * Test utilities for mocking API.
 *
 * Exports:
 *   - req
 *   - app
 */
var _ = require('underscore');


/** Function: requestMock
 * Mocks a request using the provided user.
 * Will also mock isAuthenticated which returns true if the user
 * is defined.
 *
 * Parameters:
 *   (Object) user - User object. Usually a <Resident> but can also
 *                   be e.g. null.
 *
 * Returns:
 *   (Object)
 */
function requestMock(data) {
	data = data || {};
	return {
		app: data.app
		, user: data.user
		, params: data.params
		, isAuthenticated: function() {
			return !_.isUndefined(data.user);
		}
		, param: function(key) {
			return data.params[key];
		}
	};
}

/** Function: appMock
 * Express.js App Mocking. Defines a `get` function which returns only
 * the db so far.
 *
 * Parameters:
 *   (Sequelize) db - Sequelize instance
 *
 * Returns:
 *   (Object)
 */
function appMock(db) {
	return {
		get: function(key) {
			if(key === 'db') {
				return db;
			}
		}
	};
}


module.exports = {
	req: requestMock
	, app: appMock
};