var View = require('../roomiesView')
	, formSync = require('../../forms');

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

	, submitTask: function submitTask() {
		var $form = this.$('.task-form')
			, $loader = $form.find('.loader')
			, $submitButton = $form.find('.button.success')
			, self = this;

		$loader.show();
		$submitButton.addClass('disabled').attr('disabled', true);

		function hideLoader() {
			$loader.hide();
			$submitButton.removeClass('disabled').attr('disabled', false);
		}
		function success() {
			var community = self.getDataStore().get('community');
			self.options.router.navigate('/community/' + community.get('slug') +
				'/tasks', {trigger: true});
			hideLoader();
		}
		function error() {
			hideLoader();
		}

		formSync.call(this, $form, success, error);
		return false;
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
			var $form = this.$('.task-form');
			$form.append('<input type="hidden" name="id" value="' +
				this.task.id + '">');
		}

		resolve();
	}


	, toString: function toString() {
		return 'Task.FormView';
	}
});