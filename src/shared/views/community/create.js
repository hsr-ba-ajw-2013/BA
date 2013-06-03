var View = require('../roomiesView')
	, _ = require('underscore')
	, formSync = require('../../forms');

/** Class: Views.Community.CreateView
 * Inherits from <RomiesView> and is responsible for create community form
 * rendering & handling.
 */
module.exports = View.extend({
	el: '#main'

	, events: {
		'submit .community-create-form': 'submitCreateCommunity'
	}

	/** Function: submitCreateCommunity
	 * On submitting the form, it will save the new model and redirect
	 * to the created community task list.
	 */
	, submitCreateCommunity: function submitCreateCommunity() {
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

	/** Function: beforeRender
	 * Before rendering this method will check if the user already has a
	 * community. If yes, it will redirect to the task list.
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, beforeRender: function beforeRender(resolve) {
		var community = this.getDataStore().get('community');
		if(community) {
			this.options.router.navigate('/community/' + community.get('slug') +
				'/tasks', {trigger: true});
		}
		resolve();
	}

	/** Function: renderView
	 * Renders the create community template
	 */
	, renderView: function renderView() {
		var user = this.getDataStore().get('currentUser');
		if(!_.isUndefined(user)) {
			user = user.toJSON();
		}

		this.$el.html(this.templates.community.create({ user: user }));
	}

	/** Function: afterRender
	 * After rendering the template, it will assign the document title.
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, afterRender: function afterRender(resolve) {
		this.setDocumentTitle(this.translate('Create Community'));
		resolve();
	}

	/** Function: toString
	 * Return string representation of this class.
	 */
	, toString: function toString() {
		return 'Community.CreateView';
	}
});