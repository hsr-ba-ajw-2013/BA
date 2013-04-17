/** Module: Flash
 * <connect-flash at https://github.com/jaredhanson/connect-flash> enables
 * express.js or connect applications to easily display flash messages to the
 * user.
 */

var flash = require('connect-flash');

/** Function: flashInit
 * Initializes <connect-flash at https://github.com/jaredhanson/connect-flash>.
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *   (Object) config - Configuration
 */
module.exports = function flashInit(app) {
	app.use(flash());

	app.use(function(req, res, next) {
		app.locals.messages = req.flash();

		next();
	});
};