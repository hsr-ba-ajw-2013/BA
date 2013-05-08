/** Class: Utils.EventEmitter
 * Event emitter
 */

var util = require('util')
	, events = require('events');

function EventEmitter() {
	events.EventEmitter.call(this);
	this.allListeners = [];
}
util.inherits(EventEmitter, events.EventEmitter);


EventEmitter.prototype.off = function off(event, listener) {
	if(event === 'all') {
		var removed = [];
		for(var i = 0, l = this.allListeners.length; i < l; i++) {
			var currListener = this.allListeners[i];
			if(currListener === listener) {
				removed.push(this.allListeners.splice(i, 1));
			}
		}
		return removed;
	}
	/* jshint camelcase:false */
	this.super_.removeListener(event, listener);
};

EventEmitter.prototype.on = function on(event, listener) {
	if(event === 'all') {
		return this.allListeners.push(listener);
	}
	/* jshint camelcase: false */
	EventEmitter.super_.prototype.on.apply(this, arguments);
};

EventEmitter.prototype.trigger = function trigger(event) {
	/* jshint camelcase:false */
	if(event === 'all') {
		for(var i = 0, l = this.allListeners.length; i < l; i++) {
			this.allListeners[i](arguments);
		}
		return true;
	}
	this.emit(event, arguments);
};

module.exports = EventEmitter;