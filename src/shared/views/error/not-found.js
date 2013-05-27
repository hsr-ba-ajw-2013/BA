var View = require('../roomiesView');

module.exports = View.extend({
	el: '#main'

	, renderView: function() {
		this.$el.html(this.templates.error.notFound());
	}

	, afterRender: function(resolve) {
		this.setDocumentTitle(this.translate('404 Not Found'));
		resolve();
	}


	, toString: function toString() {
		return 'Error.NotFound';
	}
});