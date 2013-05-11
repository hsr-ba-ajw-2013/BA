var View = require('./roomiesView')
	, ResidentModel = require('../models/resident')
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
		var resident = new ResidentModel();
		resident.set('facebookId', '1329590618');
		resident.fetch();
		//console.log('Fetch: ', resident);

		this.$el.html(this.template({}));
	}

	, events: {
		'click .fixed-navigation': 'onClickFixedNavigation'
	}

	, onClickFixedNavigation: function onClickFixedNavigation() {
		var resident = new ResidentModel();
		resident.set('facebookId', '1329590618');
		resident.fetch();
	}
});