var util = require('util')
	, BaseRule = require('./base');

/** Class: NPointsRule
 * When reward points are given, call cb with "true".
 */
function NPointsRule(points) {
	this.points = points;
	BaseRule.call(this);
}

util.inherits(NPointsRule, BaseRule);

NPointsRule.prototype.matches = function matches(type, data, cb) {
	var resident = data[0]
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