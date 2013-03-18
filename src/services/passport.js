/**
 * Passport configuration
 */

module.exports = function(config, sequelize) {
	var express = require('express')
		, passport = require('passport')
		, FacebookStrategy = require('passport-facebook').Strategy
		, app = express();

	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID
			, clientSecret: config.facebook.clientSecret
			, callbackURL: config.facebook.callbackUrl
		},
		function findOrCreateResident(accessToken, refreshToken, profile, done) {
			var Resident = sequelize.daoFactoryManager.getDAO('Resident');
			Resident.find({where: {facebookId: profile.id}}).success(function(resident) {
				if (!resident) {
					Resident.create({
						facebookId: profile.id,
						name: profile.displayName
					}).success(function(resident) {
						return done(null, resident);
					}).error(function(err) {
						return done(err);
					})
				} else {
					if (resident.enabled) {
						return done(null, resident);
					}
					return done('User disabled');
				}
			}).error(function(err) {
				return done(err);
			});
		}
	));

	passport.serializeUser(function(resident, done) {
		done(null, resident.id);
	});

	passport.deserializeUser(function(id, done) {
		var Resident = sequelize.daoFactoryManager.getDAO('Resident');
		Resident.find(id).success(function(resident) {
			done(null, resident);
		}).error(function(err) {
			done(err);
		});
	});

	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/'
		, failureRedirect: '/login'
		, failureFlash: true
	}));

	return app;
}