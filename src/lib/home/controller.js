/** Controller: Home.Controller
 * Home Controller
 */

/** Function: index
 */
exports.index = function index(req, res) {
	res.render('home/views/index', { title: res.__('Welcome at Roomies!') });
};