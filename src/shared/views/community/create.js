var View = require('../roomiesView')
	, _ = require('underscore');

module.exports = View.extend({
	el: '#main'
	, initialize: function() {

	}

	, beforeRender: function(resolve) {
		var community = this.getDataStore().get('community');
		if(community) {
			this.options.router.navigate('/community/' + community.get('slug') +
				'/tasks', {trigger: true});
		}
		resolve();
	}

	, renderView: function() {
		var user = this.getDataStore().get('currentUser');
		if(!_.isUndefined(user)) {
			user = user.toJSON();
		}

		this.$el.html(this.templates.community.create({ user: user }));
	}
	, afterRender: function(resolve) {
		this.setDocumentTitle(this.translate('Create Community'));
		resolve();
	}

	, toString: function toString() {
		return 'Community.CreateView';
	}
});