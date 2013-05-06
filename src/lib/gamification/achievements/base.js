/** Interface: BaseAchievement
 * Base Interface for Achievements
 */

var IDENTIFIER = 'base';

function BaseAchievement() {
	this.identifier = IDENTIFIER;
};

BaseAchievement.prototype.giveAchievementIfMatches = function(db, data) {
	throw new Error('Not implemented');
};

module.exports = BaseAchievement;