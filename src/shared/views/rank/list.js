var View = require('../roomiesView')
	, _ = require('underscore');

module.exports = View.extend({
	el: '#main'

	, initialize: function() {
		var ranks = this.options.dataStore.get('ranks');
		this.ranks = ranks;
		ranks.on('sync', this.renderRanks.bind(this));
	}

	, renderView: function() {
		this.$el.html(this.templates.rank.list({}));

		this.renderRanks();
	}

	, beforeRender: function(resolve) {
		if(this.ranks.models.length === 0) {
			this.ranks.fetch({success: function() {
				resolve();
			}});
		} else {
			resolve();
		}
	}

	, renderRanks: function() {
		var self = this
			, ranks = this.options.dataStore.get('ranks')
			, tableBody = this.$('table.scoreboard tbody', this.$el);

		_.each(ranks.models, function(rank) {
			var data = rank.toJSON();
			tableBody.append(self.templates.rank.listItem(data));
		});
	}

	, afterRender: function(resolve) {
		this.setDocumentTitle(this.translate('Ranking'));
		resolve();
	}

	, toString: function toString() {
		return 'Rank.ListView';
	}
});