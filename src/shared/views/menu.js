var View = require('./roomiesView')
	, _ = require('underscore');

module.exports = View.extend({
	el: '.fixed-navigation'

	, renderView: function renderView() {
		var user = this.getDataStore().get('currentUser');
		if(!_.isUndefined(user)) { user = user.toJSON(); }

		this.$el.html(this.templates.menu({ user: user}));
	}
});