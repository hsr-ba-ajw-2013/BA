var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, TaskModel = Model.extend({
		idAttribute: 'id'
		, toString: function toString() {
			return 'TaskModel';
		}
	});

module.exports = TaskModel;