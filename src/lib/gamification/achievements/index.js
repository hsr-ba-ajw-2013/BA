/** Module: Gamification.Achievements
 * Enabled Achievements
 */

var FirstTaskAchievement = require('./first-task')
	, TenTasksAchievement = require('./ten-tasks')
	, TwentyPointsAchievement = require('./twenty-points');

exports.achievements = [
	new FirstTaskAchievement()
	, new TenTasksAchievement()
	, new TwentyPointsAchievement()
];

exports.identifiers = function() {
	var ids = [];
	for(var obj in exports.achievements) {
		ids.push(exports.achievements[obj].identifier);
	}
	return ids;
};