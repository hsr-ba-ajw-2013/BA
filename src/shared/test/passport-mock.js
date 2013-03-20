var passport = require('passport')
	, StrategyMock = require('./strategy-mock');

module.exports = function(app, passAuthentication) {
	passport.use(new StrategyMock(passAuthentication));
	app.get('/mock/login', passport.authenticate('mock', {
		//assignProperty: 'user',
		successRedirect: '/community'
	}));
};