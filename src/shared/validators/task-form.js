/** Module: CreateTaskValidator
 * Create task validator
 */

/** Function: createTaskValidator
 * Validates & Sanitizes the task form.
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 *   (Function) next - Callback
 */
module.exports = function createTaskValidator(req, res, next) {
	var error = res.__('Name needs to be within 1 and 255 chars.');
	req.assert('name', error).len(1, 255);
	req.sanitize('name').xss();
	req.sanitize('name').trim();

	error = res.__('Reward needs to be a number between 1 and 5.');
	req.assert('reward', error).len(1, 1).isInt();
	req.sanitize('reward').xss();
	req.sanitize('reward').trim();

	error = res.__('Due date needs to be a date in the future.');
	req.assert('dueDate', error).isDate().isAfter();
	req.sanitize('dueDate').xss();
	req.sanitize('dueDate').trim();

	error = res.__('Description needs to be within 0 and 255 chars.');
	req.assert('description', error).len(0, 255);
	req.sanitize('description').xss();
	req.sanitize('description').trim();

	var errors = req.validationErrors();
	if(errors) {
		req.flash('error', errors[0].msg);
		if (req.params.id) {
			return res.redirect('.');
		}
		return res.redirect('./new');
	}
	return next();
};