/* global $ */
var View = require('./roomiesView')
	, _ = require('underscore');

module.exports = View.extend({
	el: 'header#menu'

	, events: {
		"click a": "onClickMenuItem"
	}

	, onClickMenuItem: function onClickMenuItem(evt) {
		var $el = $(evt.currentTarget)
			, href = $el.attr('href');
		this.options.router.navigate(href, {trigger: true});
		return false;
	}

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

	, toString: function toString() {
		return 'MenuView';
	}
});