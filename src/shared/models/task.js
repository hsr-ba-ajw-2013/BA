var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, TaskModel = Model.extend({
		urlRoot: '/api/task'
		, idAttribute: 'id'
	});

module.exports = TaskModel;