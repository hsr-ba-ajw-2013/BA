var View = require('../roomiesView')
	, _ = require('underscore');

module.exports = View.extend({
	el: '#main'

	, events: {
		'click .create-task': 'onClickCreateTask'
		, 'click .edit-task': 'onClickEditTask'
		, 'submit .check form': 'onSubmitMarkTaskDone'
	}

	, initialize: function initialize() {
		this.tasks = this.getDataStore().get('tasks');
		this.tasks.on('sync', this.renderTasks.bind(this));
	}

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

	, onClickCreateTask: function onClickCreateTask(evt) {
		var $el = this.$(evt.currentTarget)
			, href = $el.attr('href');

		this.options.dataStore.set('task', undefined);
		this.options.router.navigate(href, {trigger: true});
		return false;
	}

	, onClickEditTask: function onClickEditTask(evt) {
		var $el = this.$(evt.currentTarget)
			, href = $el.attr('href');

		this.options.router.navigate(href, {trigger: true});
		return false;
	}

	, beforeRender: function beforeRender(resolve) {
		if(this.tasks.models.length === 0) {
			this.tasks.fetch({
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

	, renderView: function renderView() {
		var community = this.getDataStore().get('community');
		this.$el.html(this.templates.task.list({
			community: community.toJSON()
		}));
		this.renderTasks();
	}

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

	, afterRender: function afterRender(resolve) {
		this.setDocumentTitle(this.translate('Tasks'));
		resolve();
	}


	, toString: function toString() {
		return 'Task.ListView';
	}
});