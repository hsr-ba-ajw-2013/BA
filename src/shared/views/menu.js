var View = require('./roomiesView')
	, UserModel = require('../models/user')
	, templates = require('../templates');

module.exports = View.extend({
	el: '.fixed-navigation'
	, template: templates.menu

	, beforeRender: function beforeRender() {
		/* jshint camelcase:false */ // Ensures that jshint ignores __super__
		templates.setLocale(this.options.locale);
		this.constructor.__super__.beforeRender.call(this);
	}

	, renderView: function() {
		var user = new UserModel();
		user.fetch();

		this.$el.html(this.template({}));
	}
});