var util = require('util')
	, BaseRule = require('./base');

/** Class: FirstTaskRule
 * When first task is achieved, an achievement is sent.
 */
function FirstTaskRule() {
	BaseRule.call(this);
}

util.inherits(FirstTaskRule, BaseRule);

FirstTaskRule.prototype.matches = function matches(data, cb) {
	var resident = data[0];
	resident.getFulfilledTasks().success(function tasksFound(tasks) {
		if(tasks.length === 1) {
			return cb(true);
		}
		cb(false);
	});
};

module.exports = FirstTaskRule;