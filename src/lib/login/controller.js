/** Controller: Login.Controller
 * Login Controller
 */

/** Function: login
 */
exports.login = function login(req, res) {
	res.render('login/views/login', { title: res.__('Welcome at Roomies!') });
};
exports.logout = function logout(req, res) {
	req.logout();
	res.redirect('/');
};