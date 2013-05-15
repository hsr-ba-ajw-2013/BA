var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, ResidentModel = Model.extend({
		urlRoot: '/api/resident'
		, idAttribute: 'facebookId'
	});

module.exports = ResidentModel;