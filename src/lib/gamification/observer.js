/** Module: Observer
 * Observer of various events to process.
 */

var achievements = require('./achievements').achievements;

function taskDone(db, eventBus, data) {
	// remove event name (first value in data object)
	data = Array.prototype.splice.call(data, 1, data.length);
	achievements.forEach(function(achievement) {
		achievement.giveAchievementIfMatches(db, data, function(matches, identifier) {
			if(matches) {
				eventBus.trigger('achievement:added:' + identifier);
			}
		});
	});
}

module.exports = function setupObserver(eventBus, db) {
	eventBus.on('task:done', taskDone.bind(this, db, eventBus));
};