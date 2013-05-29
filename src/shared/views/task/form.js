var View = require('../roomiesView')
	, API_PREFIX = '/api';

module.exports = View.extend({
	el: '#main'

	, events: {
		'submit .task-create-form': 'submitCreateTask'
	}

	, submitCreateTask: function() {
		/* global $ */
		var $form = $('.task-create-form')
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

	, renderView: function() {
		var community = this.options.dataStore.get('community');
		this.$el.html(this.templates.task.form({
			action: '/community/' + community.get('slug') +
				'/task'
			, title: this.translate('Create Task')
		}));
	}

	, afterRender: function(resolve) {
		this.setDocumentTitle(this.translate('Create Task'));
		resolve();
	}


	, toString: function toString() {
		return 'Task.FormView';
	}
});