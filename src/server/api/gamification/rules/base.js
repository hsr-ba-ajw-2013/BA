/** Class: Api.Gamification.Rules.BaseRule
 * Interface for doing rules.
 */
function BaseRule() {
}

/** Function: matches
 * Checks if this rule matches
 */
BaseRule.prototype.matches = function matches(type, data, cb) {
	/* jshint unused: false */
	throw new Error('Not implemented');
};

module.exports = BaseRule;