var View = require('../roomiesView')
	, formSync = require('../../forms');

/** Class: Views.Task.FormView
 * Inherits from <RoomiesView> and is responsible for Task Form rendering.
 */
module.exports = View.extend({
	el: '#main'

	, events: {
		'submit .task-form': 'onSubmitTask'
	}

	/** Function: initialize
	 * Initializes the view.
	 */
	, initialize: function initialize() {
		var task = this.options.dataStore.get('task');

		if(task) {
			this.task = task;
			task.on('sync', this.renderView.bind(this));

			this.title = 'Edit Task';
		} else {
			this.title = 'Create Task';
			this.task = undefined;
		}
	}

	/** Function: onSubmitTask
	 * Submit handler for the task form.
	 */
	, onSubmitTask: function onSubmitTask() {
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

	/** Function: beforeRender
	 * Fetches the task if not yet fetched.
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, beforeRender: function beforeRender(resolve) {
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

	/** Function: renderView
	 * Renders the task form.
	 */
	, renderView: function renderView() {
		var community = this.getDataStore().get('community')
			, action = '/community/' + community.get('slug') + '/tasks'
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

	/** Function: afterRender
	 * Sets the document title and adds the id as a hidden value
	 * if it's an edit task action.
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, afterRender: function afterRender(resolve) {
		this.setDocumentTitle(this.translate(this.title));

		if(this.task) {
			var $form = this.$('.task-form');
			$form.append('<input type="hidden" name="id" value="' +
				this.task.id + '">');
		}

		resolve();
	}

	/** Function: toString
	 * Returns a string representation of this class.
	 */
	, toString: function toString() {
		return 'Task.FormView';
	}
});