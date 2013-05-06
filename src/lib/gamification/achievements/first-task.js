/** Class: FirstAchievement
 * Achievement given upon first task done
 */

var util = require('util')
	, BaseAchievement = require('./base')
	, FirstTaskRule = require('../rules').FirstTaskRule
	, IDENTIFIER = 'first-task';

function FirstAchievement() {
	this.identifier = IDENTIFIER;
	this.rule = new FirstTaskRule();
}

util.inherits(FirstAchievement, BaseAchievement);

FirstAchievement.prototype.giveAchievementIfMatches = function(db, data, cb) {
	var self = this;
	this.rule.matches(data, function matchChecked(matches) {
		if(!matches) {
			return cb(matches);
		}
		var resident = data[0]
			, Achievement = db.daoFactoryManager.getDAO('Achievement');
		Achievement.create({
			type: self.identifier
		}).success(function createdAchievement(achievement) {
			achievement.setResident(resident).success(function addedToResident() {
				cb(matches);
			}).error(function(err) {
				console.log(err);
			});
		}).error(function(err) {
			console.log(err);
		})
	})
};


module.exports = FirstAchievement;