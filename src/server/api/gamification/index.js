/** Component: Gamification
 * This component handles the whole gamification of roomies using the event-bus
 * and achievements.
 */

var observer = require('./observer');

module.exports = function setupAchievements(api) {
	var app = api.app
		, db = app.get('db')
		, eventBus = app.get('eventbus');
	eventBus.on('task:done', observer.taskDone.bind(this, db, eventBus));
};