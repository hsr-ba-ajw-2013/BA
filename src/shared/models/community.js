var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, CommunityModel = Model.extend({
		urlRoot: '/api/community'
		, idAttribute: 'id'
		, toString: function toString() {
			return 'CommunityModel';
		}
	});

module.exports = CommunityModel;