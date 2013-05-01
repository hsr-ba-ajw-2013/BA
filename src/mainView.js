var View = require('./roomiesView')
	, MenuView = require('./menuView');

module.exports = View.extend({
	initialize: function() {
		this.addSubview(new MenuView());
	}
});