/** Controller: Task.Controller
 * Task Controller
 */

exports.index = function taskIndex(req, res) {
	res.render('task/views/index', {
		title: res.__('Tasks')
	});
};