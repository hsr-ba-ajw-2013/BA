var View = require('../roomiesView')
	, _ = require('underscore');

/** Class: Views.Task.ListView
 * Inherits from <RoomiesView> and is responsible for task list view rendering.
 */
module.exports = View.extend({
	el: '#main'

	, events: {
		'click .create-task': 'onClickCreateTask'
		, 'click .edit-task': 'onClickEditTask'
		, 'submit .check form': 'onSubmitMarkTaskDone'
	}

	/** Function: initialize
	 * Initializes the task list view.
	 */
	, initialize: function initialize() {
		this.tasks = this.getDataStore().get('tasks');
		this.tasks.on('sync', this.renderTasks.bind(this));
	}

	/** Function: onSubmitMarkTaskDone
	 * Handles mark as done clicks.
	 */
	, onSubmitMarkTaskDone: function onSubmitMarkTaskDone(evt) {
		var self = this
			, $el = this.$(evt.currentTarget)
			, taskId = $el.data('task-id')
			, task = this.tasks.get(taskId)
			, resident = this.getDataStore().get('currentUser');

		try {
			task.save({
				fulfilledAt: new Date()
				, fulfillorId: resident.id
			}, {
				success: function() {
					self.tasks.remove(task);
					var $td = $el.parent();
					$td.html('<i class="icon-check"></i>');
					self.options.eventAggregator.trigger(
						'view:update-flashmessages');
				}
			});
		} catch(err) {
			console.error(err);
		}

		return false;
	}

	/** Function: onClickCreateTasks
	 * Handles create task button clicks.
	 */
	, onClickCreateTask: function onClickCreateTask(evt) {
		var $el = this.$(evt.currentTarget)
			, href = $el.attr('href');

		this.options.dataStore.set('task', undefined);
		this.options.router.navigate(href, {trigger: true});
		return false;
	}

	/** Function: onClickEditTask
	 * Handles edit task clicks.
	 */
	, onClickEditTask: function onClickEditTask(evt) {
		var $el = this.$(evt.currentTarget)
			, href = $el.attr('href');

		this.options.router.navigate(href, {trigger: true});
		return false;
	}

	/** Function: beforeRender
	 * Before render fetches the tasks if not yet fetched.
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, beforeRender: function beforeRender(resolve) {
		/* jshint camelcase:false */
		var _super = this.constructor.__super__.beforeRender.bind(this)
			, resolver = function resolver() {
				_super(resolve);
			};

		if(this.tasks.models.length === 0) {
			this.tasks.fetch({
				success: resolver
				, error: resolver
			});
		} else {
			resolver();
		}
	}

	/** Function: renderView
	 * Renders the view
	 */
	, renderView: function renderView() {
		var community = this.getDataStore().get('community');
		this.$el.html(this.templates.task.list({
			community: community.toJSON()
		}));
		this.renderTasks();
	}

	/** Function: renderTasks
	 * Renders tasks.
	 */
	, renderTasks: function renderTasks() {
		var self = this
			, tasks = this.getDataStore().get('tasks')
			, $tableBody = this.$('table.tasks tbody', this.$el)
			, community = this.getDataStore().get('community').toJSON()
			, resident = this.getDataStore().get('currentUser')
			, now = new Date();

		$tableBody.empty();

		if(tasks.models.length === 0) {
			$tableBody.append(self.templates.task.noTasks());
		} else {
			_.each(tasks.models, function(task) {
				var data = task.toJSON();
				data.community = community;
				data.resident = resident;
				data.now = now;
				$tableBody.append(self.templates.task.listItem(data));
			});
		}
	}

	/** Function: afterRender
	 * Sets the document title
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
	, afterRender: function afterRender(resolve) {
		/* jshint camelcase:false */
		var _super = this.constructor.__super__.afterRender.bind(this);

		this.setDocumentTitle(this.translate('Tasks'));
		_super(resolve);
	}

	/** Function: toString
	 * Returns a string representation of this class.
	 */
	, toString: function toString() {
		return 'Task.ListView';
	}
});