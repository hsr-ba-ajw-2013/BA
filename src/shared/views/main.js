var View = require('./roomiesView')
	, MenuView = require('./menu');

module.exports = View.extend({
	initialize: function() {
		this.addSubview(new MenuView());
	}
});