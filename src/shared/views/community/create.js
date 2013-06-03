var View = require('../roomiesView')
	, _ = require('underscore')
	, formSync = require('../../forms');

module.exports = View.extend({
	el: '#main'

	, events: {
		'submit .community-create-form': 'submitCreateCommunity'
	}

	, submitCreateCommunity: function() {
		var $form = this.$('.community-create-form')
			, $loader = $form.find('.loader')
			, $submitButton = $form.find('.button.success');

		$loader.show();
		$submitButton.addClass('disabled').attr('disabled', true);

		function hideLoader() {
			$loader.hide();
			$submitButton.removeClass('disabled').attr('disabled', false);
		}

		function success(community) {
			// hard reload
			/* global window */
			window.location = '/community/' + community.get('slug') + '/tasks';
			hideLoader();
		}

		function error() {
			hideLoader();
		}

		formSync.call(this, $form, success, error);
		return false;
	}

	, beforeRender: function(resolve) {
		var community = this.getDataStore().get('community');
		if(community) {
			this.options.router.navigate('/community/' + community.get('slug') +
				'/tasks', {trigger: true});
		}
		resolve();
	}

	, renderView: function() {
		var user = this.getDataStore().get('currentUser');
		if(!_.isUndefined(user)) {
			user = user.toJSON();
		}

		this.$el.html(this.templates.community.create({ user: user }));
	}
	, afterRender: function(resolve) {
		this.setDocumentTitle(this.translate('Create Community'));
		resolve();
	}

	, toString: function toString() {
		return 'Community.CreateView';
	}
});