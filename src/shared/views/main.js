var View = require('./roomiesView')
	, MenuView = require('./menu');

module.exports = View.extend({
	initialize: function(options) {
		this.addSubview(new MenuView(options));
	}
	, renderView: function renderView() {

	}
});