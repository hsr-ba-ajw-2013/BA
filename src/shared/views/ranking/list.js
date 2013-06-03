var View = require('../roomiesView')
	, _ = require('underscore');

/** Class: Views.Ranking.ListView
 * Inherits from <RomiesView> and is responsible for the ranking list view.
 */
module.exports = View.extend({
	el: '#main'

	, events: {
		"click a": "onClickResident"
	}

	/** Function: onClickResident
	 * When clicking on a resident this will navigate to the specified view.
	 */
	, onClickResident: function onClickResident(evt) {
		var $el = this.$(evt.currentTarget)
			, href = $el.attr('href');
		this.options.router.navigate(href, {trigger: true});
		return false;
	}

	/** Function: initialize
	 * Initializes the rankings datastore
	 */
	, initialize: function initialize() {
		var rankings = this.options.dataStore.get('rankings');
		this.rankings = rankings;
		rankings.on('sync', this.renderRankings.bind(this));
	}

	/** Function: beforeRender
	 * Fetches the rankings.
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, beforeRender: function beforeRender(resolve) {
		if(this.rankings.models.length === 0) {
			this.rankings.fetch({success: function() {
				resolve();
			}});
		} else {
			resolve();
		}
	}

	/** Fucntion: renderView
	 * Renders the ranking list
	 */
	, renderView: function renderView() {
		this.$el.html(this.templates.ranking.list({}));

		this.renderRankings();
	}

	/** Function: renderRankings
	 * Renders the ranking list
	 */
	, renderRankings: function renderRankings() {
		var self = this
			, rankings = this.options.dataStore.get('rankings')
			, tableBody = this.$('table.scoreboard tbody', this.$el);

		_.each(rankings.models, function(rank) {
			var data = rank.toJSON();
			tableBody.append(self.templates.ranking.listItem(data));
		});
	}

	/** Function: afterRender
	 * After rendering this will set the document title
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, afterRender: function afterRender(resolve) {
		this.setDocumentTitle(this.translate('Ranking'));
		resolve();
	}

	/** Function: toString
	 * String representation of this class.
	 */
	, toString: function toString() {
		return 'Ranking.ListView';
	}
});