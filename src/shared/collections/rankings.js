var Barefoot = require('node-barefoot')()
	, Collection = Barefoot.Collection
	, RankModel = require('../models/ranking')
	, RankingCollection = Collection.extend({
		model: RankModel
		, toString: function toString() {
			return 'RankingCollection';
		}
	});

module.exports = RankingCollection;