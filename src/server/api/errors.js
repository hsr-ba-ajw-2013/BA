/** Class: Api.Errors
 * Contains all API specific generic errors.
 */
var _ = require('underscore')
	, errors = require('node-barefoot')().errors

	/** Error: NotAuthorizedError
	 * Indicates that a specific API call was not allowed in the current session
	 * context.
	 *
	 * When transported to the client, this error is represented by a 401
	 * "Unauthorized" HTTP status code.
	 */
	, NotAuthorizedError = errors.createError(401, 'Unauthorized')

	/** Error: ForbiddenError
	 * Indicates that a specific API call was done authorized, but the
	 * requested action was not allowed.
	 *
	 * When transported to the client, this error is represented by a 403
	 * "Forbidden" HTTP status code.
	 */
	, ForbiddenError = errors.createError(403, 'Forbidden');

_.extend(errors, {
	NotAuthorizedError: NotAuthorizedError
	, ForbiddenError: ForbiddenError
});

module.exports = errors;