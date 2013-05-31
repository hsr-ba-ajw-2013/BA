/** Class: Api.Gamification.Rules.NPointsRule
 * When reward points are given, call cb with "true".
 */
var util = require('util')
	, BaseRule = require('./base');

function NPointsRule(points) {
	this.points = points;
	BaseRule.call(this);
}

util.inherits(NPointsRule, BaseRule);

NPointsRule.prototype.matches = function matches(type, data, cb) {
	var resident = data.resident
		, self = this;
	resident.getFulfilledTasks({attributes: ['SUM(`reward`) AS totalreward']})
		.success(function tasksFound(tasks) {
			if(tasks[0].totalreward >= self.points) {
				resident.getAchievements({where: '`type` = "' + type + '"'})
					.success(function(achievements) {
						if(!achievements.length) {
							return cb(true);
						}
						cb(false);
					});
			} else {
				cb(false);
			}
		});
};

module.exports = NPointsRule;