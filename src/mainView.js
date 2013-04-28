var Barefoot = require('barefoot')()
	, View = Barefoot.View
	, MenuView = require('./menuView');

module.exports = View.extend({
	el: 'body'
	, initialize: function() {
		this.addSubview(new MenuView());
	}
	, template: '<header><h1>Roomies</h1><nav></nav></header><section id="main"></section>'
	, renderView: function() {
		this.$el.html(this.template);
	}
});