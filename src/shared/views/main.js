var View = require('./roomiesView')
	, MenuView = require('./menu');

module.exports = View.extend({
	initialize: function(options) {
		this.addSubview(new MenuView(options));
	}

	, toString: function toString() {
		return 'MainView';
	}
});