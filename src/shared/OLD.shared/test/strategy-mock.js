/** Module: StrategyMock
 * A custom strategy to be mocked by <PassportMock>.
 */
var passport = require('passport')
	, util = require('util');

/** Class: StrategyMock
 * Custom strategy to be applied with the <PassportMock>.
 *
 * Options:
 *   (Boolean) passAuthentication - [default: true] Specify if auth should pass
 *   (Object) user - User to authenticate
 *
 * Parameters:
 *   (Object) options - Options
 *   (Function) verify - Verify callback
 */
function StrategyMock(options, verify) {
	this.name = 'mock';
	if (options.passAuthentication === undefined) {
		this.passAuthentication = true;
	} else {
		this.passAuthentication = options.passAuthentication;
	}
	this.user = options.user || 1;
	this.verify = verify;
}

util.inherits(StrategyMock, passport.Strategy);

/** Function: StrategyMock.authenticate
 * Authenticate callback of <StrategyMock>. Uses the verify function as
 * specified when initializing the <StrategyMock>.
 *
 * Only accepts authentication when passAuthentication is true and
 * the verify function returns no error.
 */
StrategyMock.prototype.authenticate = function authenticate() {
	if (this.passAuthentication) {
		var self = this;
		this.verify(this.user, function result(err, resident) {
			if(err) {
				self.fail(err);
			} else {
				self.success(resident);
			}
		});
	} else {
		this.fail('Unauthorized');
	}
};

module.exports = StrategyMock;