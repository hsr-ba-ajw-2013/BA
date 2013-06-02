/** Component: Api.Gamification
 * This component handles the whole gamification of roomies using the event-bus
 * and achievements.
 */

var observer = require('./observer')
	, debug = require('debug')('roomies:server:api:gamification');

module.exports = function setupAchievements(api) {
	debug('setup achievements');
	var app = api.app
		, db = app.get('db')
		, eventbus = app.get('eventbus');
	eventbus.on('task:done', observer.taskDone.bind(this, db, eventbus));
};