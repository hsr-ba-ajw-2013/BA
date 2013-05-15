/** Class: TwentyPointsAchievement
 * Achievement given upon twenty points achieved
 */

var util = require('util')
	, BaseAchievement = require('./base')
	, NPointsRule = require('../rules').NPointsRule
	, IDENTIFIER = 'twenty-points';

function TwentyPointsAchievement() {
	BaseAchievement.call(this);
	this.identifier = IDENTIFIER;
	this.rule = new NPointsRule(20);
}

util.inherits(TwentyPointsAchievement, BaseAchievement);

TwentyPointsAchievement.prototype.giveAchievementIfMatches =
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


module.exports = TwentyPointsAchievement;