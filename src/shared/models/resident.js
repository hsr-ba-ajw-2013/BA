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