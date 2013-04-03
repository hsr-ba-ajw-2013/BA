/** Controller: Home.Controller
 * Home Controller
 */

/** Function: index
 */
exports.index = function index(req, res) {
	res.render('home/views/index', { title: res.__('Welcome at Roomies!') });
};

exports.invite = function(req, res) {
	req = req;//FIXME REMOVE !! JSHINT IN YA FACE.
	res.send(404);
};