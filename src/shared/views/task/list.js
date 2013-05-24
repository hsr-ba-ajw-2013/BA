var View = require('../roomiesView')
	, _ = require('underscore');

module.exports = View.extend({
	el: '#main'
	, initialize: function() {
		var tasks = this.options.dataStore.get('tasks');
		this.tasks = tasks;
		tasks.on('sync', this.renderTasks.bind(this));
	}

	, beforeRender: function(resolve) {
		if(this.tasks.models.length === 0) {
			this.tasks.fetch({success: function() {
				resolve();
			}});
		} else {
			resolve();
		}
	}

	, renderView: function() {
		this.$el.html(this.templates.task.list({}));
		this.renderTasks();
	}

	, renderTasks: function() {
		var self = this
			, tasks = this.options.dataStore.get('tasks')
			, tableBody = this.$('table.tasks tbody', this.$el);

		_.each(tasks.models, function(task) {
			var data = task.toJSON();
			tableBody.append(self.templates.task.listItem(data));
		});
	}

	, afterRender: function(resolve) {
		this.setDocumentTitle(this.translate('Tasks'));
		resolve();
	}


	, toString: function toString() {
		return 'Task.ListView';
	}
});