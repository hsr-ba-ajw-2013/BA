var View = require('./roomiesView');

/** Class: Views.FlashMessagesView
 * Inherits from <RoomiesView> and is responsible for flash messages rendering.
 */
module.exports = View.extend({
	el: '#flash-messages'

	/** Function: initialize
	 * Initializes various event handlers.
	 */
	, initialize: function initialize() {
		this.messages = this.options.dataStore.get('FlashModel');
		var self = this;
		this.messages.on('sync', this.syncView.bind(this));
		this.options.router.on('route', function clearMessagesOnRoute() {
			self.messages.clear();
		});
		this.options.router.on('render', this.fetchMessages.bind(this));
		this.options.eventAggregator.on('view:flashmessage'
			, this.renderMessages.bind(this));
		this.options.eventAggregator.on('view:update-flashmessages'
			, this.fetchMessages.bind(this));
	}

	/** Function: fetchMessages
	 * Fetches the messages.
	 */
	, fetchMessages: function fetchMessages() {
		this.messages.fetch();
	}

	/** Function: beforeRender
	 * Fetches messages if there aren't any messages.
	 *
	 * Parameters:
	 *   (Promise.resolve) resolve - After successfully doing work, resolve
	 *                               the promise.
	 */
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

	/** Function: renderView
	 * Renders the flash messages
	 */
	, renderView: function renderView() {
		var flashModel = this.messages;

		if(flashModel.hasMessages()) {
			this.renderMessages(flashModel.toJSON());
			flashModel.clear();
		} else {
			this.clearMessages();
		}
	}

	/** Function: clearMessages
	 * Clears the flash messages element
	 */
	, clearMessages: function clearMessages() {
		this.$el.children('ul').remove();
	}

	/** Function: syncView
	 * Syncs the view with the model.
	 */
	, syncView: function syncView(model) {
		this.renderMessages(model.toJSON());
	}

	/** Function: renderMessages
	 * Renders the messages into the template.
	 */
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

	/** Function: toString
	 * Returns a string represenation of this class.
	 */
	, toString: function toString() {
		return 'FlashMessagesView';
	}
});