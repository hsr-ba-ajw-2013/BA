var View = require('./roomiesView')
	, MenuView = require('./menu')
	, FlashMessagesView = require('./flashMessages')
	, FooterView = require('./footer');

module.exports = View.extend({
	initialize: function(options) {
		this.addSubview(new MenuView(options));
		this.addSubview(new FlashMessagesView(options));
		this.addSubview(new FooterView(options));
	}

	, toString: function toString() {
		return 'MainView';
	}
});