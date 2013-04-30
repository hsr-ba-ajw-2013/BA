/** Module: CreateCommunityValidator
 * Create community validator
 */

module.exports = function createCommunityValidator(req, res, next) {
	var error = res.__('Name needs to be within 1 and 255 chars.');
	req.assert('name', error).len(1, 255);
	req.sanitize('name').xss();
	req.sanitize('name').trim();

	var errors = req.validationErrors();
	if(errors) {
		req.flash('error', errors[0].msg);
		return res.redirect('/community/new');
	}
	return next();
};