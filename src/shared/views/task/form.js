var View = require('../roomiesView')
	, API_PREFIX = '/api'
	, TaskModel = require('../../models/task');

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
		.done(function(task) {
			var community = self.getDataStore().get('community');
			self.getDataStore().get('tasks').add(new TaskModel(task), {
				at: 0
			});
			self.options.router.navigate('/community/' + community.get('slug') +
				'/tasks', {trigger: true});
		})
		.fail(function(response) {
			var messages = response.responseText.split(',');
			self.options.eventAggregator.trigger('view:flashmessage', {
				error: messages
			});
		})
		.always(function() {
			$loader.hide();
			$submitButton.removeClass('disabled').attr('disabled', false);
		});
		return false;
	}

	, renderView: function() {
		var community = this.getDataStore().get('community');
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