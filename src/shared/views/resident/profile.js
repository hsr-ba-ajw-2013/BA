var View = require('../roomiesView');

module.exports = View.extend({
	el: '#main'
	, initialize: function() {
		console.log("PROFILE: initialize");
		var residentProfile = this.options.dataStore.get('residentProfile');
		this.residentProfile = residentProfile;
		residentProfile.on('sync', this.renderView.bind(this));
	}

	, beforeRender: function(resolve) {
		console.log("PROFILE: beforeRender");
		if(!this.residentProfile.model) {
			this.residentProfile.fetch({success: function() {
				resolve();
			}});
		} else {
			resolve();
		}
	}

	, renderView: function() {
		var residentProfile = this.options.dataStore.get('residentProfile');
		console.log("PROFILE: renderView");
		this.$el.html(this.templates.resident.profile(residentProfile));
	}

	, afterRender: function(resolve) {
		console.log("PROFILE: afterRender");
		this.setDocumentTitle(this.translate('Profile'));
		resolve();
	}
});