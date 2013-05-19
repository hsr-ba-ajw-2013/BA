/** Module: Api.Task.Validators
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
function createTask(success, error, communitySlug, task) {
	var validator = new ErrorCollectingValidator();
	task = task || {};

	validator.check(task.name
		, 'Names length needs to be within 1 and 255')
		.len(1, 255);
	validator.check(task.reward
		, 'Reward should have an integer value between 1 and 5')
		.isInt().min(1).max(5);
	validator.check(task.dueDate
		, 'Due date needs to be a date in the future')
		.isDate();
	validator.check(task.description
		, 'Descriptions lenght needs to be within 0 and 255')
		.len(0, 255);

	task.name = sanitize(task.name).xss().trim();
	task.reward = sanitize(task.reward).xss().trim();
	task.dueDate = sanitize(task.dueDate).xss().trim();
	task.description = sanitize(task.description).xss().trim();

	var validationErrors = validator.getErrors();
	if(validationErrors && validationErrors.length) {
		console.log(validationErrors);
		error(new errors.ValidationError());
	} else {
		success();
	}
}

module.exports = {
	createTask: createTask
};