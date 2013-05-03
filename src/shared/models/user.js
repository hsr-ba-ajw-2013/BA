var Barefoot = require('barefoot')()
	, Model = Barefoot.Model
	, UserModel = Model.extend({
		url: '/api/test'
	});

module.exports = UserModel;