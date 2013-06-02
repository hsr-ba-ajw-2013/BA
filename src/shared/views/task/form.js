var View = require('../roomiesView')
	, API_PREFIX = '/api'
	, TaskModel = require('../../models/task');

module.exports = View.extend({
	el: '#main'

	, initialize: function() {
		var task = this.options.dataStore.get('task');

		this.title = 'Create Task';
		this.task = undefined;

		if (task) {
			this.task = task;
			task.on('sync', this.renderView.bind(this));

			this.title = 'Edit Task';
		}
	}

	, events: {
		'submit .task-form': 'submitTask'
	}

	, submitTask: function() {
		/* global $ */
		var $form = $('.task-form')
			, action = $form.attr('action')
			, self = this
			, $loader = $form.find('.loader')
			, $submitButton = $form.find('.button.success');

		$loader.show();
		$submitButton.addClass('disabled').attr('disabled', true);

		var doneFnc = function(task) {
			var community = self.getDataStore().get('community')
				, tasks = self.getDataStore().get('tasks');
			if(tasks) {
				tasks.add(new TaskModel(task), {
					at: 0
				});
			}
			self.options.router.navigate('/community/' + community.get('slug') +
				'/tasks', {trigger: true});
		}

		, failFnc = function(response) {
			var messages = response.responseText.split(',');
			self.options.eventAggregator.trigger('view:flashmessage', {
				error: messages
			});
		}

		,alwaysFnc = function() {
			$loader.hide();
			$submitButton.removeClass('disabled').attr('disabled', false);
		};

		if (this.task) {
			$.put(API_PREFIX + action, $form.serialize())
				.done(doneFnc)
				.fail(failFnc)
				.always(alwaysFnc);
		} else {
			$.post(API_PREFIX + action, $form.serialize())
				.done(doneFnc)
				.fail(failFnc)
				.always(alwaysFnc);
		}

		return false;
	}

	, submitCreateTask: function() {
		this.submitTask.bind(this);
	}

	, submitEditTask: function() {
		this.submitTask.bind(this);
	}

	, beforeRender: function(resolve) {
		if(this.task) {
			this.task.fetch({
				success: function() {
					resolve();
				}
				, error: function fetchError() {
					resolve();
				}
			});
		} else {
			resolve();
		}
	}

	, renderView: function() {
		var community = this.getDataStore().get('community')
			, action = '/community/' + community.get('slug') +
				'/tasks'
			, task;

		if (this.task) {
			action = action + '/' + this.task.id;
			task = this.task.toJSON();
		}

		this.$el.html(this.templates.task.form({
			action: action
			, title: this.translate(this.title)
			, task: task
		}));
	}

	, afterRender: function(resolve) {
		this.setDocumentTitle(this.translate(this.title));

		if(this.task) {
			var $form = $('.task-form');
			$form.append('<input type="hidden" name="id" value="' +
				this.task.id + '">');
		}

		resolve();
	}


	, toString: function toString() {
		return 'Task.FormView';
	}
});