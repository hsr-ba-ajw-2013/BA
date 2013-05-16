var View = require('../roomiesView');
	//, _ = require('underscore');

module.exports = View.extend({
	el: '#main'
	, initialize: function() {

	}
	, renderView: function() {
		//this.$el.html(this.templates.community.fresh({ user: user }));
	}
	, afterRender: function() {
		this.setDocumentTitle(this.translate('Tasks'));
	}
});