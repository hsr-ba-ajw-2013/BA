var View = require('./roomiesView')
	, _ = require('underscore');

module.exports = View.extend({
	el: '.fixed-navigation'

	, renderView: function renderView() {
		var user = this.getDataStore().get('currentUser')
			, community = this.getDataStore().get('community');

		if(!_.isUndefined(user)) { user = user.toJSON(); }
		if(!_.isUndefined(community)) { community = community.toJSON(); }

		this.$el.html(this.templates.menu({
			user: user
			, community: community
		}));
	}
});