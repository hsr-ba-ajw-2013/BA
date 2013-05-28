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

	/** Error: NoTasksFoundError
	 * When there aren't any tasks for the community, return this error
	 * to be easily catcheable by the client.
	 */
	, NoTasksFoundError = errors.createError(404, 'NoTasksFoundError');

_.extend(errors, apiErrors, {
	ResidentAlreadyInCommunityError: ResidentAlreadyInCommunityError
	, CommunityAlreadyExistsError: CommunityAlreadyExistsError
	, NoTasksFoundError: NoTasksFoundError
});

module.exports = errors;