/** Component: Middleware.Validator
 * Express-Validator middleware
 */
var expressValidator = require('express-validator');

module.exports = function validatorInit(app) {
	app.use(expressValidator);
};