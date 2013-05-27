var View = require('../roomiesView');

module.exports = View.extend({
	el: '#main'

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
		return 'Task.ListView';
	}
});