/** Interface: BaseRule
 * Interface for doing rules.
 */
function BaseRule() {

};

/** Function: matches
 * Checks if this rule matches
 */
BaseRule.prototype.matches = function matches(data, cb) {
	throw new Error('Not implemented');
};

module.exports = BaseRule;