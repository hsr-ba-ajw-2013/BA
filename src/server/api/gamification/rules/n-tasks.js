/** Class: Api.Gamification.Rules.NTasksRule
 * When number of tasks are done, call cb with "true".
 */

var util = require('util')
	, BaseRule = require('./base');


function NTasksRule(number) {
	this.number = number;
	BaseRule.call(this);
}

util.inherits(NTasksRule, BaseRule);

NTasksRule.prototype.matches = function matches(type, data, cb) {
	var resident = data.resident
		, self = this;
	resident.getFulfilledTasks().success(function tasksFound(tasks) {
		if(tasks.length === self.number) {
			return cb(true);
		}
		cb(false);
	});
};

module.exports = NTasksRule;