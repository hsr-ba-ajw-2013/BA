/** Class: Api.Community.Controller
 * Community-related CRUD
 */
var debug = require('debug')('roomies:api:flash-messages:controller')
	, eventsMap = {
		"task:created": {
			type: "success"
			, text: "Task created successfully"
		}, "task:done": {
			type: "success"
			, text: "Task marked as done successfully"
		}
	}
	, messages = {};

function _mapEvents(evt) {
	debug('got event `%s`', evt);
	var msg = eventsMap[evt];
	if(messages[msg.type]) {
		messages[msg.type].push(msg.text);
	} else {
		messages[msg.type] = [msg.text];
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
	var msgs = messages;
	messages = {};
	success(msgs);
}

function setupObservers(app) {
	var eventBus = app.get('eventbus');

	for(var evt in eventsMap) {
		eventBus.on(evt, _mapEvents.bind(this, evt));
	}
}

module.exports = {
	getFlashMessages: getFlashMessages
	, setupObservers: setupObservers
};