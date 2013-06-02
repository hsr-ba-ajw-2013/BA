/** Class: Api.Gamification.Observer
 * Observer of various events to process.
 */

var achievements = require('./achievements').achievements
	, debug = require('debug')('roomies:server:api:gamification');

function taskDone(db, eventbus, resident, task) {
	debug('task marked as done');
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
					eventbus.emit('achievement:added:' + identifier);
				}
		});
	});
}

module.exports = {
	taskDone: taskDone
};