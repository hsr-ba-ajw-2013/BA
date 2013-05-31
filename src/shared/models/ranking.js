var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, RankingModel = Model.extend({
		url: function () {
			return 'api/community/' +
				this.community.slug +
				'/rankings'; }
	});

module.exports = RankingModel;