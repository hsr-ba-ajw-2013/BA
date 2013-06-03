var View = require('./roomiesView')
	, MenuView = require('./menu')
	, FlashMessagesView = require('./flashMessages')
	, FooterView = require('./footer');

/** Class: Views.MainView
 * Inherits from <RoomiesView> and is the main view where all other views
 * are added as a subview on rendering.
 */
module.exports = View.extend({
	/** Function: initialize
	 * Initializes subviews
	 */
	initialize: function initialize(options) {
		this.addSubview(new MenuView(options));
		this.addSubview(new FlashMessagesView(options));
		this.addSubview(new FooterView(options));
	}

	/** Function: toString
	 * Returns a string representation of this view.
	 */
	, toString: function toString() {
		return 'MainView';
	}
});