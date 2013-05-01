var View = require('./roomiesView')
	, templates = require('./templates');

module.exports = View.extend({
	el: '.fixed-navigation'
	, template: templates.menu

	, beforeRender: function beforeRender() {
		templates.setLocale(this.options.locale);
		this.__proto__.__proto__.beforeRender.call(this);
	}

	, renderView: function() {
		this.$el.html(this.template({user:{}}));
	}
});