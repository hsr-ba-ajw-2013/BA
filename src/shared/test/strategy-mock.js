var passport = require('passport')
	, util = require('util');

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