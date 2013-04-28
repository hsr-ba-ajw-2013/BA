var Barefoot = require('barefoot')()
	, View = Barefoot.View
	, MenuView = require('./menuView');

module.exports = View.extend({
	el: 'body'
	, initialize: function() {
		this.addSubview(new MenuView());
	}
	, template: ''
	, renderView: function() {
		this.$el.html(this.template);
	}
});