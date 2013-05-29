var View = require('./roomiesView');

module.exports = View.extend({
	el: '.flash-messages'

	, initialize: function() {
		this.messages = this.options.dataStore.get('FlashModel');
		this.options.router.on('render', this.fetchMessages.bind(this));
	}

	, fetchMessages: function() {
		var self = this;
		this.messages.fetch({
			success: function() {
				self.renderView();
			}
		});
	}

	, renderView: function() {
		var self = this
			, flashModel = this.options.dataStore.get('FlashModel')
			, ul = this.$el.children('ul');

		if(flashModel.hasMessages()) {
			var html = self.templates.flashMessages({
					messages: flashModel.toJSON()
				});
			if(ul.length) {
				ul.replaceWith(html);
			} else {
				this.$el.append(html);
			}
			flashModel.clear();
		} else {
			ul.remove();
		}
	}

	, toString: function toString() {
		return 'FlashMessagesView';
	}
});