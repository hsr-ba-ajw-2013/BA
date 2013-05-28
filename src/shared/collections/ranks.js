var Barefoot = require('node-barefoot')()
	, Collection = Barefoot.Collection
	, RankModel = require('../models/rank')
	, RankCollection = Collection.extend({
		model: RankModel
	});

module.exports = RankCollection;