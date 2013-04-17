/** Module: Validator
 * Express-Validator middleware
 */

var expressValidator = require('express-validator');

/** Function: validatorInit
 * Initializes the validator middleware.
 */
module.exports = function validatorInit(app) {
	app.use(expressValidator);
};