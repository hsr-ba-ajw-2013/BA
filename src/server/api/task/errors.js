/** Class: Api.Task.Errors
 *
 */
var Barefoot = require('node-barefoot')()
	, errors = Barefoot.errors
	, apiErrors = require('../errors')
	, _ = require('underscore')

	/** Error: NoTasksFoundError
	 * When there aren't any tasks for the community, return this error
	 * to be easily catcheable by the client.
	 */
	, NoTasksFoundError = errors.createError(404, 'NoTasksFoundError');

_.extend(errors, apiErrors, {
	NoTasksFoundError: NoTasksFoundError
});

module.exports = errors;