/** Class: Models.Ranking
 * Ranking model as a subclass of <Barefoot.Model at
 * http://swissmanu.github.io/barefoot/docs/files/lib/model-js.html>
 */
var Barefoot = require('node-barefoot')()
	, Model = Barefoot.Model
	, RankingModel = Model.extend({
		url: function () {
			return 'api/community/' +
				this.community.slug +
				'/rankings'; }
		, toString: function toString() {
			return 'RankingModel';
		}
	});

module.exports = RankingModel;