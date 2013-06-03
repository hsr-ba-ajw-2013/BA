/** Class: Models.Task
 * Task model as a subclass of <Barefoot.Model at
 * http://swissmanu.github.io/barefoot/docs/files/lib/model-js.html>
 */
var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, TaskModel = Model.extend({
		idAttribute: 'id'
		, toString: function toString() {
			return 'TaskModel';
		}
	});

module.exports = TaskModel;