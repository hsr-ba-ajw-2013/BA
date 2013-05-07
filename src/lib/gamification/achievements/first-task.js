/** Class: FirstAchievement
 * Achievement given upon first task done
 */

var util = require('util')
	, BaseAchievement = require('./base')
	, FirstTaskRule = require('../rules').FirstTaskRule
	, IDENTIFIER = 'first-task';

function FirstAchievement() {
	BaseAchievement.call(this);
	this.identifier = IDENTIFIER;
	this.rule = new FirstTaskRule();
}

util.inherits(FirstAchievement, BaseAchievement);

FirstAchievement.prototype.giveAchievementIfMatches = function(db, data, cb) {
	var self = this;
	this.rule.matches(data, function matchChecked(matches) {
		if(!matches) {
			return cb(false);
		}
		self.giveAchievement(db, data[0], cb);
	});
};


module.exports = FirstAchievement;