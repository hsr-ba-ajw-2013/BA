/** Class: Api.FlashMessages.Controller
 * API Controller for interacting flash messages.
 */

var _ = require('underscore')
	, debug = require('debug')('roomies:api:flash-messages:controller')
	, eventsMap = {
		"task:created": {
			type: "success"
			, text: "Task created successfully"
		}
		, "task:done": {
			type: "success"
			, text: "Task marked as done successfully"
		}
		, "community:created": {
			type: "success"
			, text: "Community created successfully"
		}
		, "community:deleted": {
			type: "info"
			, text: "Community has been deleted"
		}
		, "validation:error": {
			type: "error"
		}
	}
	, _messages = {};

function _mapEvents(evt, eventData) {
	debug('got event `%s`', evt);
	var msg = eventsMap[evt]
		, text = msg.text;
	if(eventData && !msg.text) {
		text = eventData;
	}
	if(_messages[msg.type]) {
		if(_.isArray(text)) {
			_messages[msg.type].concat(text);
		} else {
			_messages[msg.type].push(text);
		}
	} else {
		if(_.isArray(text)) {
			_messages[msg.type] = text;
		} else {
			_messages[msg.type] = [text];
		}
	}
}

/** Function: getFlashMessages
 * Returns flash messages
 *
 * Parameters:
 *   (Function) success - Callback on success. Will pass the flash messages.
 *   (Function) error - Callback in case of an error
 */
function getFlashMessages(success) {
	debug('get flash messages');
	var msgs = _messages;
	_messages = {};
	success(msgs);
}

function setupObservers(app) {
	var eventBus = app.get('eventbus');

	for(var evt in eventsMap) {
		if(eventsMap.hasOwnProperty(evt)) {
			eventBus.on(evt, _mapEvents.bind(this, evt));
		}
	}
}

module.exports = {
	getFlashMessages: getFlashMessages
	, setupObservers: setupObservers
};