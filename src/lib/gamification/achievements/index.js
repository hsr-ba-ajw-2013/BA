/** Module: Gamification.Achievements
 * Enabled Achievements
 */

var FirstTaskAchievement = require('./first-task')
	, TenTasksAchievement = require('./ten-tasks');

exports.achievements = [
	new FirstTaskAchievement()
	, new TenTasksAchievement()
];

exports.identifiers = function() {
	var ids = [];
	for(var obj in exports.achievements) {
		ids.push(exports.achievements[obj].identifier);
	}
	return ids;
};