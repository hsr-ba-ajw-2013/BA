"use strict";

module.exports = function(app, config) {
	var __ = app.get('__');

	if (app.get('user')) {
		app.locals.navigation = [
			{
				url: '/task'
				, icon: 'list'
				, title: __('Tasks')
			}
			, {
				url: '/rank'
				, icon: 'trophy'
				, title: __('Rank')
			}
			, {
				url: '/invite'
				, icon: 'share'
				, title: __('Invite')
			}
		]
	} else {
		app.locals.navigation = [];
	}
}