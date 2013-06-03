/** Class: Collections.Tasks
 * Tasks collection as a subclass of <Barefoot.Collection at
 * http://swissmanu.github.io/barefoot/docs/files/lib/collection-js.html>
 */
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