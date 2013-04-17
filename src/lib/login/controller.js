/** Controller: Login.Controller
 * Login Controller
 */

/** Function: login
 * Renders a login form
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
exports.login = function login(req, res) {
	res.render('login/views/login', { title: res.__('Welcome at Roomies!') });
};

/** Function: logout
 * Logs a user out (needs to be logged-in to be able to call this URL).
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
exports.logout = function logout(req, res) {
	req.logout();
	res.redirect('/');
};