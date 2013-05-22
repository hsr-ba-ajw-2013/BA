var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, CommunityModel = Model.extend({
		urlRoot: '/api/community'
		, idAttribute: 'id'
	});

module.exports = CommunityModel;