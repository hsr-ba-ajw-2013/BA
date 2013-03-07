/*---------------------
	:: Task
	-> controller
---------------------*/
var TaskController = {
	get: function(req, res) {
		var id = req.param('id');

		Task.find(id).done(function(err, task) {
			User.find(task.userId).done(function(err, user) {
				res.json({
					'task': task,
					'user': user
				});
			});
		});
	}

};
module.exports = TaskController;