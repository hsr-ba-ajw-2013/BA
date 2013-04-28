var Barefoot = require('barefoot')()
	, View = Barefoot.View
	, templates = require('./templates');

module.exports = View.extend({
	el: 'nav'
	, initialize: function() {
		//this.addSubview(new NavigationView());
	}
	, template: templates.menu
	, renderView: function() {
		this.$el.html(this.template({user:{}}));
	}
});