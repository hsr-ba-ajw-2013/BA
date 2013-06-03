var View = require('../roomiesView')
	, _ = require('underscore');

module.exports = View.extend({
	el: '#main'

	, events: {
		"click a": "onClickResident"
	}

	, onClickResident: function onClickResident(evt) {
		var $el = $(evt.currentTarget)
			, href = $el.attr('href');
		this.options.router.navigate(href, {trigger: true});
		return false;
	}

	, initialize: function initialize() {
		var rankings = this.options.dataStore.get('rankings');
		this.rankings = rankings;
		rankings.on('sync', this.renderRankings.bind(this));
	}

	, renderView: function renderView() {
		this.$el.html(this.templates.ranking.list({}));

		this.renderRankings();
	}

	, beforeRender: function beforeRender(resolve) {
		if(this.rankings.models.length === 0) {
			this.rankings.fetch({success: function() {
				resolve();
			}});
		} else {
			resolve();
		}
	}

	, renderRankings: function renderRankings() {
		var self = this
			, rankings = this.options.dataStore.get('rankings')
			, tableBody = this.$('table.scoreboard tbody', this.$el);

		_.each(rankings.models, function(rank) {
			var data = rank.toJSON();
			tableBody.append(self.templates.ranking.listItem(data));
		});
	}

	, afterRender: function afterRender(resolve) {
		this.setDocumentTitle(this.translate('Ranking'));
		resolve();
	}

	, toString: function toString() {
		return 'Ranking.ListView';
	}
});