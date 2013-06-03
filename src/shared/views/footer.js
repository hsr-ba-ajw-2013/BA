/* global $ */
var View = require('./roomiesView')
	, _ = require('underscore');

/** Class: Views.FooterView
 * Inherits from <RoomiesView> and is responsible for the footer rendering.
 */
module.exports = View.extend({
	el: 'footer'

	, events: {
		"click a#logout": "onClickLogout"
	}

	/** Function: onClickLogout
	 * Handles logout click event.
	 */
	, onClickLogout: function onClickLogout(event) {
		var $el = $(event.currentTarget)
			, href = $el.attr('href');
		this.options.router.navigate(href, {trigger: true});
		return false;
	}

	/** Function: renderView
	 * Renders the footer.
	 */
	, renderView: function renderView() {
		var user = this.getDataStore().get('currentUser');
		if(!_.isUndefined(user)) { user = user.toJSON(); }

		this.$el.html(this.templates.footer({ user: user }));
	}

	/** Function: toString
	 * Returns a string representation of this class.
	 */
	, toString: function toString() {
		return 'FooterView';
	}
});