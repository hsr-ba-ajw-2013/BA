/** Controller: Task.Controller
 * Task Controller
 */

exports.index = function index(req, res) {
	res.render('task/views/index', {
		title: res.__('Tasks')
	});
};

exports.create = exports.fresh = exports.get = exports.update =
	exports.del = function(req, res) {
		req = req;//FIXME REMOVE !! JSHINT IN YA FACE.
		res.send(404);
};