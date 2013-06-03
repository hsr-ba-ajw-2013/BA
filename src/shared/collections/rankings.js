/** Class: Collections.Rankings
 * Rankings collection as a subclass of <Barefoot.Collection at
 * http://swissmanu.github.io/barefoot/docs/files/lib/collection-js.html>
 */
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