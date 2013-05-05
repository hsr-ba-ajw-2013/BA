var View = require('./roomiesView')
	, templates = require('../templates');

module.exports = View.extend({
	el: '#main'
	, initialize: function() {

	}
	, renderView: function() {
		this.$el.html(templates.community.fresh({}));
	}
	, afterRender: function() {
		this.setDocumentTitle('Create Community');
	}
});