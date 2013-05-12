/** Class: TenTasksAchievement
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

TenTasksAchievement.prototype.giveAchievementIfMatches = function(db, data, cb) {
	var self = this;
	this.rule.matches(data, function matchChecked(matches) {
		if(!matches) {
			return cb(false);
		}
		self.giveAchievement(db, data[0], cb);
	});
};


module.exports = TenTasksAchievement;