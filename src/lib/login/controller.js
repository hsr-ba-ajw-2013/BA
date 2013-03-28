/** Controller: Login.Controller
 * Login Controller
 */

/** Function: index
 */
exports.index = function index(req, res) {
	res.render('login/views/index', { title: res.__('Welcome at Roomies!') });
};