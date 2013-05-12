/** Interface: BaseAchievement
 * Base Interface for Achievements
 */

function BaseAchievement() {
}

BaseAchievement.prototype.giveAchievementIfMatches =
	function giveAchievementIfMatches(db, data) {
	/* jshint unused: false */
	throw new Error('Not implemented');
};

BaseAchievement.prototype.giveAchievement =
	function giveAchievement(db, resident, cb) {
	var Achievement = db.daoFactoryManager.getDAO('Achievement')
		, self = this;
	Achievement.create({
		type: this.identifier
	}).success(function createdAchievement(achievement) {
		achievement.setResident(resident).success(function addedToResident() {
			cb(true, self.identifier);
		}).error(function(err) {
			console.log(err);
		});
	}).error(function(err) {
		console.log(err);
	});
};

module.exports = BaseAchievement;