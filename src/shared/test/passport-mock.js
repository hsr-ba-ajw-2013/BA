var passport = require('passport')
	, StrategyMock = require('./strategy-mock');

module.exports = function(app, options) {
	var db = app.get('db');
	passport.use(new StrategyMock(options, function createResident(resident, done) {
		var Resident = db.daoFactoryManager.getDAO('Resident');
		Resident.create({
			facebookId: resident.id,
			name: 'TEST'
		}).success(function(resident) {
			return done(null, resident);
		}).error(function(err) {
			return done(err);
		})
	}));

	app.get('/mock/login', passport.authenticate('mock', {
		successRedirect: '/community'
	}));
};