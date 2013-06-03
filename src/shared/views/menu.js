var View = require('./roomiesView')
	, _ = require('underscore');

/** Class: Views.MenuView
 * Inherits from <RoomiesView> and is responsible for menu handling & rendering.
 */
module.exports = View.extend({
	el: 'header#menu'

	, events: {
		"click a": "onClickMenuItem"
	}

	/** Function: onClickMenuItem
	 * Handles clicks on the menu.
	 */
	, onClickMenuItem: function onClickMenuItem(evt) {
		var $el = this.$(evt.currentTarget)
			, href = $el.attr('href');
		this.options.router.navigate(href, {trigger: true});
		return false;
	}

	/** Function: renderView
	 * Renders the menu.
	 */
	, renderView: function renderView() {
		var user = this.getDataStore().get('currentUser')
			, community = this.getDataStore().get('community');

		if(!_.isUndefined(user)) { user = user.toJSON(); }
		if(!_.isUndefined(community)) { community = community.toJSON(); }

		this.$el.html(this.templates.menu({
			user: user
			, community: community
		}));
	}

	/** Function: toString
	 * Returns a string representation of this class.
	 */
	, toString: function toString() {
		return 'MenuView';
	}
});