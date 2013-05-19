/** Class: Api.Rank.Errors
 *
 */
var Barefoot = require('node-barefoot')()
	, errors = Barefoot.errors
	, apiErrors = require('../errors')
	, _ = require('underscore')


	, NoResidentInCommunityError = errors.createError(500
					, 'NoResidentInCommunityError');

_.extend(errors, apiErrors, {
	NoResidentInCommunityError: NoResidentInCommunityError
});

module.exports = errors;