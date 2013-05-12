var View = require('./roomiesView')
	, templates = require('../templates')
	, _ = require('underscore');

module.exports = View.extend({
	el: '#main'
	, initialize: function() {

	}
	, renderView: function() {
		var applicationModel = this.getApplicationModel()
			, user = applicationModel.get('user');
		if(!_.isUndefined(user)) { user = user.toJSON(); }

		this.$el.html(templates.community.fresh({ user: user }));
	}
	, afterRender: function() {
		this.setDocumentTitle(this.translate('Create Community'));
	}
});