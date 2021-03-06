/** Class: Models.Resident
 * Resident model as a subclass of <Barefoot.Model at
 * http://swissmanu.github.io/barefoot/docs/files/lib/model-js.html>
 */
var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, ResidentModel = Model.extend({
		urlRoot: '/api/resident'
		, idAttribute: 'id'
		, toString: function toString() {
			return 'ResidentModel';
		}
	});

module.exports = ResidentModel;