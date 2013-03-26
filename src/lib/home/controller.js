/** Controller: Home.Controller
 * Home Controller
 */

/** Function: index
 */
var index = function index(req, res) {
	res.render('home/views/index', { title: res.__('Welcome at Roomies!') });
};

exports.index = function(req, res) {