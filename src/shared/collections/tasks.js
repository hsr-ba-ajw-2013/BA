var Barefoot = require('node-barefoot')()
	, Collection = Barefoot.Collection
	, TaskModel = require('../models/task')
	, TaskCollection = Collection.extend({
		model: TaskModel
		, toString: function toString() {
			return 'TaskCollection';
		}
	});

module.exports = TaskCollection;