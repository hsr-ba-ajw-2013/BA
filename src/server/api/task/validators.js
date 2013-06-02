/** Class: Api.Task.Validators
 * Create task validator
 */

var ErrorCollectingValidator = require('../errorCollectingValidator')
	, errors = require('../errors')
	, sanitize = require('validator').sanitize;

/** Function: createTask
 * Validates and sanitizes a task object passed to the API.
 *
 * Side effect disclaimer! This function modifies the task argument due
 * sanitizing needs.
 *
 * Parameters:
 *   (Function) success - Callback to be called after a successful validation
 *   (Function) error - Callback to be called after a failed validation
 *   (String) communitySlug - The slug of the community to create the task for.
 *   (Object) task - The information about a task object to validate and
 *                   sanitize.
 */
function createTask(success, error, communitySlug, taskIdOrData, dataOrNone) {
	var validator = new ErrorCollectingValidator();
	var data = dataOrNone || taskIdOrData || {};

	validator.check(data.name
		, 'Name length needs to be within 1 and 255')
		.len(1, 255);
	validator.check(data.reward
		, 'Reward should have an integer value between 1 and 5')
		.isInt().min(1).max(5);
	validator.check(data.dueDate
		, 'Due date needs to be a date in the future')
		.isDate().isAfter();
	validator.check(data.description
		, 'Description length needs to be within 0 and 255')
		.len(0, 255);

	data.name = sanitize(data.name).xss().trim();
	data.reward = sanitize(data.reward).toInt();
	data.dueDate = sanitize(data.dueDate).xss().trim();
	data.description = sanitize(data.description).xss().trim();

	var validationErrors = validator.getErrors();
	if(validationErrors && validationErrors.length) {
		error(new errors.ValidationError(validationErrors));
	} else {
		success();
	}
}

module.exports = {
	createTask: createTask
};