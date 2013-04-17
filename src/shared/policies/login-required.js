/** Module: Policy.LoginRequired
 * Policy for enforcing login
 */

var Exception401 = require('../exceptions/401');

/** Function: loginRequired
 * Express.js capable request handler for checking using <PassportJs
 * at http://passportjs.org>.
 *
 * Will throw a <Exception401> if not authenticated.
 *
 * Parameters:
 *    (Request) req - Request
 *    (Response) res - The response to render into
 *    (Function) next - Callback for the next request handler
 */
module.exports = function loginRequired(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	req.session.redirectUrl = req.url;

	return next(new Exception401("Unauthorized"));
};