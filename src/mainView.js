var Barefoot = require('barefoot')()
	, _ = require('underscore')
	, View = Barefoot.View
	, MenuView = require('./menuView');

module.exports = View.extend({
	initialize: function() {
		this.addSubview(new MenuView());
	}
});