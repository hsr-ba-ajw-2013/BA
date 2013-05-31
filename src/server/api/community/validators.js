/** Class: Api.Community.Validators
 * Validator functions for the Community domain object.
 */

var ErrorCollectingValidator = require('../errorCollectingValidator')
	, errors = require('./errors')
	, sanitize = require('validator').sanitize;

/** Function: createCommunity
 * Validates and sanitizes a community object passed to the API.
 *
 * Side effect disclaimer! This function modifies the community argument due
 * sanitizing needs.
 *
 * Parameters:
 *   (Function) success - Callback to be called after a successful validation
 *   (Function) error - Callback to be called after a failed validation
 *   (Object) community - The information about a community object to validate
 *                        and sanitize.
 */
function createCommunity(success, error, community) {
	var validator = new ErrorCollectingValidator();
	community = community || {};

	validator.check(community.name
		, 'Names length needs to be within 1 and 255')
		.len(1, 255);

	community.name = sanitize(community.name).xss().trim();

	var validationErrors = validator.getErrors();
	if(validationErrors && validationErrors.length) {
		error(new errors.ValidationError(validationErrors));
	} else {
		success();
	}
}

module.exports = {
	createCommunity: createCommunity
};