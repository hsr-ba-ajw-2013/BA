var Barefoot = require('barefoot')()
	, View = Barefoot.View;

module.exports = View.extend({
	el: 'nav'
	, initialize: function() {
		//this.addSubview(new NavigationView());
	}
	, template: 'Menu'
	, renderView: function() {
		this.$el.html(this.template);
	}
});