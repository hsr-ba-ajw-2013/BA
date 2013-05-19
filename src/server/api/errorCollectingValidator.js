/** Class: Api.ErrorCollectingValidator
 * As proposed by <node-validator at
 * https://github.com/chriso/node-validator#error-handling>, the
 * ErrorCollectingValidator is a node-validator extension which collects all
 * validation errors in an internal array instead releasing them to the
 * environment.
 *
 * After validation has finished, just call <getErrors> to get an array of all
 * captured validation errors.
 */
var Validator = require('validator').Validator;

Validator.prototype.error = function(message) {
	this._errors.push(message);
	return this;
};

/** Function: getErrors
 * Returns an error with all collected validation errors so far.
 *
 * Returns:
 *     (Array) with validation errors.
 */
Validator.prototype.getErrors = function() {
	return this._errors;
};

module.exports = Validator;