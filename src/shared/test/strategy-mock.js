"use strict";

var passport = require('passport')
	, util = require('util');

function StrategyMock(passAuthentication) {
	this.name = 'mock';
	this.passAuthentication = passAuthentication;
}

util.inherits(StrategyMock, passport.Strategy);

StrategyMock.prototype.authenticate = function authenticate(req) {
	if (this.passAuthentication) {
		var user = {
			id: 1
		};
		this.success(user);
	} else {
		this.fail('Unauthorized');
	}
}

module.exports = StrategyMock;