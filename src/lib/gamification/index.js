/** Component: Gamification
 * This component handles the whole gamification of roomies using the event-bus
 * and achievements.
 */

var observer = require('./observer')
	, model = require('./model');

module.exports = function setupAchievements(app) {
	observer(app.get('eventbus'), app.get('db'));

	return model(app);
};