/*---------------------
	:: Task
	-> controller
---------------------*/
var TaskController = {
	get: function(req, res) {
		var id = req.param('id');
		Task.find(id).done(function(err, task) {
			User.find(task.userId).done(function(err, user) {
				var response = {
					'task': task,
					'user': user,
					'title': task.name
				};

				if (req.acceptJson) {
					res.json(response);
				} else if(req.isAjax && req.param('partial')) {
					response['layout'] = false;
					res.view(response);
				} else {
					res.view(response);
				}
			});
		});
	}

};
module.exports = TaskController;