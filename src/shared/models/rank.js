var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, RankModel = Model.extend({
		url: function () {
			return 'api/community/' +
				this.community.slug +
				'/rank'; }
	});

module.exports = RankModel;