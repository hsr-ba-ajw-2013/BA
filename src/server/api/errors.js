/** Class: Api.Errors
 * Contains all API specific generic errors.
 */
var _ = require('underscore')
	, barefootErrors = require('node-barefoot')().errors

	/** Error: NotAuthorizedError
	 * Indicates that a specific API call was not allowed in the current session
	 * context.
	 *
	 * When transported to the client, this error is represented by a 401
	 * "Unauthorized" HTTP status code.
	 */
	, NotAuthorizedError = barefootErrors.createError(401, 'Unauthorized');

_.extend(barefootErrors, {
	NotAuthorizedError: NotAuthorizedError
});

module.exports = barefootErrors;