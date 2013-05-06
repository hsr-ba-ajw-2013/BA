/** Component: EventBus
 * Application-wide event bus
 */

var EventEmitter = require('../../shared/utils').EventEmitter;

module.exports = function setupEventBus(app) {
	var EventBus = new EventEmitter();
	app.set('eventbus', EventBus);
};