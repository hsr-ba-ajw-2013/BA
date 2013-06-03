/** Class: Api.FlashMessages.Controller
 * API Controller for interacting flash messages.
 */

var _ = require('underscore')
	, debug = require('debug')('roomies:api:flash-messages:controller')
	/** PrivateVariable: _eventsMap
	 * Map for event types <-> message types & texts
	 */
	, _eventsMap = {
		"task:created": {
			type: "success"
			, text: "Task created successfully"
		}
		, "task:done": {
			type: "success"
			, text: "Task marked as done successfully"
		}
		, "task:updated": {
			type: "success"
			, text: "Task updated successfully"
		}
		, "community:created": {
			type: "success"
			, text: "Community created successfully"
		}
		, "community:deleted": {
			type: "info"
			, text: "Community has been deleted"
		}
		, "community:joined": {
			type: "success"
			, text: "Community has been joined"
		}
		, "validation:error": {
			type: "error"
		}
	}
	/** PrivateVariable: _messages
	 * Flash messages temporary store
	 */
	, _messages = {};

/** PrivateFunction: _mapEvents
 * Maps given events to their messages & message types
 *
 * Parameters:
 *   (Event) event - Event from the EventEmitter
 *   (Object) eventData - Data
 */
function _mapEvents(evt, eventData) {
	debug('got event `%s`', evt);
	var msg = _eventsMap[evt]
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

/** Function: setupObservers
 * Sets listeners for every event in the <_eventsMap>.
 */
function setupObservers(app) {
	var eventBus = app.get('eventbus');

	for(var evt in _eventsMap) {
		if(_eventsMap.hasOwnProperty(evt)) {
			eventBus.on(evt, _mapEvents.bind(this, evt));
		}
	}
}

module.exports = {
	getFlashMessages: getFlashMessages
	, setupObservers: setupObservers
};