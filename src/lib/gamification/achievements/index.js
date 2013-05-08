/** Module: Gamification.Achievements
 * Enabled Achievements
 */

var FirstTaskAchievement = require('./first-task');

exports.achievements = [
	new FirstTaskAchievement()
];

exports.identifiers = function() {
	var ids = [];
	for(var obj in exports.achievements) {
		ids.push(exports.achievements[obj].identifier);
	}
	return ids;
};