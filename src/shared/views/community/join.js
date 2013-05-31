var View = require('../roomiesView');

module.exports = View.extend({
	el: '#main'

	, initialize: function() {
		var community = this.options.dataStore.get('community');
		this.community = community;
	}

	, beforeRender: function(resolve) {
		if(!this.community.has('name')) {
			this.community.fetch({
				success: function() {
					resolve();
				}
				, error: function fetchError() {
					resolve();
				}
			});
		} else {
			resolve();
		}
	}

	, renderView: function() {
		var community = this.community
			, user = this.getDataStore().get('currentUser');

		this.$el.html(this.templates.community.join({
			user: user.toJSON()
			, name: community.get('name')
			, slug: community.get('slug')
			, shareLink: community.get('shareLink')
		}));
	}

	, afterRender: function(resolve) {
		this.setDocumentTitle(this.translate('Join Community'));
		resolve();
	}
	, toString: function toString() {
		return 'Community.JoinView';
	}
});