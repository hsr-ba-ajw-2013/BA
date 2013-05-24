var View = require('../roomiesView')
	, _ = require('underscore');

module.exports = View.extend({
	el: '#main'
	, initialize: function() {

	}
	, renderView: function() {
		var ranks = this.getDataStore().get('ranks');
		if(!_.isUndefined(ranks)) { ranks = ranks.toJSON(); }

		this.$el.html(this.templates.rank.index({ ranks: ranks }));
	}
	, afterRender: function(resolve) {
		this.setDocumentTitle(this.translate('Ranking'));
		resolve();
	}

	, toString: function toString() {
		return 'Rank.MainView';
	}
});