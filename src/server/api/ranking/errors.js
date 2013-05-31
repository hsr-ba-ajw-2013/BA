/** Class: Api.Ranking.Errors
 *
 */
var Barefoot = require('node-barefoot')()
	, errors = Barefoot.errors
	, apiErrors = require('../errors')
	, _ = require('underscore')

	/** Error: NoResidentInCommunityError
	 * When querying the ranking list, this error indicates that there are no
	 * residents available for that particular community.
	 *
	 * This error is represented by an HTTP status code 404 when transmitted
	 * over the HTTP protocol.
	 */
	, NoResidentInCommunityError = errors.createError(404
					, 'NoResidentInCommunityError');

_.extend(errors, apiErrors, {
	NoResidentInCommunityError: NoResidentInCommunityError
});

module.exports = errors;