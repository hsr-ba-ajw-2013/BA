var View = require('./roomiesView')
	, templates = require('../templates');

module.exports = View.extend({
	el: '#main'
	, initialize: function() {

	}
	, template: templates.login
	, renderView: function() {
		this.$el.html(this.template({}));
	}
	, afterRender: function() {
		this.setDocumentTitle('Welcome');
	}
});