var View = require('../roomiesView')
	, _ = require('underscore')
	, API_PREFIX = '/api';

module.exports = View.extend({
	el: '#main'

	, events: {
		'submit .community-create-form': 'submitCreateCommunity'
	}

	, submitCreateCommunity: function() {
		/* global $ */
		var $form = $('.community-create-form')
			, action = $form.attr('action')
			, self = this
			, $loader = $form.find('.loader')
			, $submitButton = $form.find('.button.success');

		$loader.show();
		$submitButton.addClass('disabled').attr('disabled', true);

		$.post(API_PREFIX + action, $form.serialize())
		.done(function(redirectUri) {
			self.options.router.navigate(redirectUri, {trigger: true});
		})
		.fail(function() {
			console.error(arguments);
		})
		.always(function() {
			$loader.hide();
			$submitButton.removeClass('disabled').attr('disabled', false);
		});
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