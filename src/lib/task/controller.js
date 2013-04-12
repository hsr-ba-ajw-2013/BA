/** Controller: Task.Controller
 * Task Controller
 */

exports.index = function index(req, res) {
	var resident = req.user;

	resident.getCommunity().success(function result(community) {

		if (!community) {
			return res.redirect('/');
		}

		community.getTasks().success(function result(tasks) {
			res.render('task/views/index', {
				title: res.__('Tasks')
				, tasks: tasks
			});
		});
	});
};

exports.create = exports.fresh = exports.get = exports.update =
	exports.del = function(req, res) {
		req = req;//FIXME REMOVE !! JSHINT IN YA FACE.
		res.send(404);
};