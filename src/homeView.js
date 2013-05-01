var View = require('./roomiesView');

module.exports = View.extend({
	el: '#main'
	, initialize: function() {

	}
	, template: 'Home :)'
	, renderView: function() {
		this.$el.html(this.template);
	}
});