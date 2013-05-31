/* global $ */
var View = require('../roomiesView')
	, _ = require('underscore');

module.exports = View.extend({
	el: '#main'

	, events: {
		'click .create-task': "createTaskClick"
	}

	, initialize: function() {
		var tasks = this.options.dataStore.get('tasks');
		this.tasks = tasks;
		tasks.on('sync', this.renderTasks.bind(this));
	}

	, createTaskClick: function(evt) {
		var $el = $(evt.currentTarget)
			, href = $el.attr('href');
		this.options.router.navigate(href, {trigger: true});
		return false;
	}

	, beforeRender: function(resolve) {
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

	, renderView: function() {
		var community = this.options.dataStore.get('community');
		this.$el.html(this.templates.task.list({
			community: community.toJSON()
		}));
		this.renderTasks();
	}

	, renderTasks: function() {
		var self = this
			, tasks = this.options.dataStore.get('tasks')
			, tableBody = this.$('table.tasks tbody', this.$el)
			, community = this.options.dataStore.get('community').toJSON();

		if(tasks.models.length === 0) {
			tableBody.append(self.templates.task.noTasks());
		} else {
			_.each(tasks.models, function(task) {
				var data = task.toJSON();
				data.community = community;
				tableBody.append(self.templates.task.listItem(data));
			});
		}
	}

	, afterRender: function(resolve) {
		this.setDocumentTitle(this.translate('Tasks'));
		resolve();
	}


	, toString: function toString() {
		return 'Task.ListView';
	}
});