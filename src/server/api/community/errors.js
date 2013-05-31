/** Class: Api.Community.Errors
 *
 */
var Barefoot = require('node-barefoot')()
	, errors = Barefoot.errors
	, apiErrors = require('../errors')
	, _ = require('underscore')

	/** Error: ResidentAlreadyInCommunityError
	 * An error indicating that a resident is already inhabitant of a community.
	 *
	 * Represented by an HTTP status code 409 "Conflict"
	 */
	, ResidentAlreadyInCommunityError = errors.createError(409
										, 'ResidentAlreadyInCommunityError')

	/** Error: CommunityAlreadyExistsError
	 * During creation of a community, this error indicates that that particular
	 * community the user tries to create already exists.
	 *
	 * Represented by an HTTP status code 409 "Conflict"
	 */
	, CommunityAlreadyExistsError = errors.createError(409
										, 'CommunityAlreadyExistsError')

	/** Error: InvalidShareLink
	 * Error to indicate that the share link is invalid
	 *
	 * Represented by an HTTP status code 400 "Bad Request"
	 */
	, InvalidShareLink = errors.createError(400, "InvalidShareLink");

_.extend(errors, apiErrors, {
	ResidentAlreadyInCommunityError: ResidentAlreadyInCommunityError
	, CommunityAlreadyExistsError: CommunityAlreadyExistsError
	, InvalidShareLink: InvalidShareLink
});

module.exports = errors;