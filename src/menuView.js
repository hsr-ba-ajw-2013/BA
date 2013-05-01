var Barefoot = require('barefoot')()
	, View = Barefoot.View
	, templates = require('./templates');

module.exports = View.extend({
	el: '.fixed-navigation'
	, template: templates.menu
	, renderView: function() {
		templates.setLocale(this.options.locale);
		this.$el.html(this.template({user:{}}));
	}
});