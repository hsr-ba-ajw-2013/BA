var Barefoot = require('node-barefoot')()
	, Collection = Barefoot.Collection
	, TaskModel = require('../models/task')
	, TaskCollection = Collection.extend({
		model: TaskModel
	});

module.exports = TaskCollection;