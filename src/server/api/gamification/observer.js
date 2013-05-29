/** Module: Observer
 * Observer of various events to process.
 */

var achievements = require('./achievements').achievements;

function taskDone(db, eventBus, resident, task) {
	// Different events could create different arguments, pack them together
	// in a data map.
	var data = {
		resident: resident
		, task: task
	};
	achievements.forEach(function(achievement) {
		achievement.giveAchievementIfMatches(db, data,
			function(matches, identifier) {
				if(matches) {
					eventBus.emit('achievement:added:' + identifier);
				}
		});
	});
}

module.exports = {
	taskDone: taskDone
};