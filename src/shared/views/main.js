var View = require('./roomiesView')
	, MenuView = require('./menu')
	, FlashMessagesView = require('./flashMessages');

module.exports = View.extend({
	initialize: function(options) {
		this.addSubview(new MenuView(options));
		this.addSubview(new FlashMessagesView(options));
	}

	, toString: function toString() {
		return 'MainView';
	}
});