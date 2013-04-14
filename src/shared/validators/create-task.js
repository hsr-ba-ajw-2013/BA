/** Module: Shared.Validators.createTaskValidator
 * Create task validator
 */

module.exports = function createTaskValidator(req, res, next) {
	var error = res.__('Name needs to be within 1 and 255 chars.');
	req.assert('txtTask', error).len(1, 255);
	req.sanitize('txtTask').xss();
	req.sanitize('txtTask').trim();

	error = res.__('Reward needs to be a number between 1 and 5.');
	req.assert('txtReward', error).len(1, 1).isInt();
	req.sanitize('txtReward').trim();

	error = res.__('Due date needs to be a date in the future.');
	req.assert('txtDueDate', error).isDate();
	req.sanitize('txtDueDate').trim();

	error = res.__('Description needs to be within 0 and 255 chars.');
	req.assert('txtDescription', error).len(0, 255);
	req.sanitize('txtDescription').xss();
	req.sanitize('txtDescription').trim();

	var errors = req.validationErrors();
	if(errors) {
		req.flash('error', errors[0].msg);
		return res.redirect('./new');
	}
	return next();
};