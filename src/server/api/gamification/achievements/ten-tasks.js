/** Class: Api.Gamification.Achievements.TenTasksAchievement
 * Achievement given upon ten tasks done
 */

var util = require('util')
	, BaseAchievement = require('./base')
	, NTasksRule = require('../rules').NTasksRule
	, IDENTIFIER = 'ten-tasks';

function TenTasksAchievement() {
	BaseAchievement.call(this);
	this.identifier = IDENTIFIER;
	this.rule = new NTasksRule(10);
}

util.inherits(TenTasksAchievement, BaseAchievement);

TenTasksAchievement.prototype.giveAchievementIfMatches =
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

TenTasksAchievement.prototype.toString = function() {
	return 'TenTasksAchievement';
};


module.exports = TenTasksAchievement;