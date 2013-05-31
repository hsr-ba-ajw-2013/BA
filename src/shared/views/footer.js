/* global $ */
var View = require('./roomiesView')
	, _ = require('underscore');

module.exports = View.extend({
	el: 'footer'

	, events: {
		"click a.logout": "onClickLogout"
	}

	, onClickLogout: function onClickLogout(event) {
		var $el = $(event.currentTarget)
			, href = $el.attr('href');
		this.options.router.navigate(href, {trigger: true});
		return false;
	}

	, renderView: function renderView() {
		var user = this.getDataStore().get('currentUser');
		if(!_.isUndefined(user)) { user = user.toJSON(); }

		this.$el.html(this.templates.footer({ user: user }));
	}

	, toString: function toString() {
		return 'FooterView';
	}
});