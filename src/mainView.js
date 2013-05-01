var View = require('./roomiesView')
	, _ = require('underscore')
	, MenuView = require('./menuView');

module.exports = View.extend({
	initialize: function() {
		this.addSubview(new MenuView());
	}
});