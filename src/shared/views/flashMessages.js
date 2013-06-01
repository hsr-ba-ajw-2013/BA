var View = require('./roomiesView');

module.exports = View.extend({
	el: '#flash-messages'

	, initialize: function() {
		this.messages = this.options.dataStore.get('FlashModel');
		var self = this;
		this.messages.on('sync', this.syncView.bind(this));
		this.options.router.on('route', function clearMessagesOnRoute() {
			self.messages.clear();
		});
		this.options.router.on('render', this.fetchMessages.bind(this));
		this.options.eventAggregator.on('view:flashmessage'
			, this.renderMessages.bind(this));
	}

	, fetchMessages: function fetchMessages() {
		this.messages.fetch();
	}

	, beforeRender: function beforeRender(resolve) {
		if(!this.messages.hasMessages()) {
			this.messages.fetch({
				success: function successFetch() {
					resolve();
				}
			});
		} else {
			resolve();
		}
	}

	, renderView: function renderView() {
		var flashModel = this.messages;

		if(flashModel.hasMessages()) {
			this.renderMessages(flashModel.toJSON());
			flashModel.clear();
		} else {
			this.clearMessages();
		}
	}

	, clearMessages: function clearMessages() {
		this.$el.children('ul').remove();
	}

	, syncView: function syncView(model) {
		this.renderMessages(model.toJSON());
	}

	, renderMessages: function renderMessages(messages) {
		var ul = this.$el.children('ul')
			, html = this.templates.flashMessages({
				messages: messages
			});
		if(ul.length) {
			ul.replaceWith(html);
		} else {
			this.$el.append(html);
		}
	}

	, toString: function toString() {
		return 'FlashMessagesView';
	}
});