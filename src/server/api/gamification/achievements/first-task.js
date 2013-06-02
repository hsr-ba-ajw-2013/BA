/** Class: Api.Gamification.Achievements.FirstTaskAchievement
 * Achievement given upon first task done
 */

var util = require('util')
	, BaseAchievement = require('./base')
	, NTasksRule = require('../rules').NTasksRule
	, IDENTIFIER = 'first-task';

function FirstTaskAchievement() {
	BaseAchievement.call(this);
	this.identifier = IDENTIFIER;
	this.rule = new NTasksRule(1);
}

util.inherits(FirstTaskAchievement, BaseAchievement);

FirstTaskAchievement.prototype.giveAchievementIfMatches =
	function(db, data, cb) {
		var self = this;
		this.rule.matches(this.identifier, data,
			function matchChecked(matches) {
				if(!matches) {
					return cb(false);
				}
				self.giveAchievement(db, data.resident, cb);
		});
};

FirstTaskAchievement.prototype.toString = function() {
	return 'FirstTaskAchievement';
};


module.exports = FirstTaskAchievement;