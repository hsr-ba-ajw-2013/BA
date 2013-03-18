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
			, callbackURL: config.facebook.callbackURL
		},
		function findOrCreateUser(accessToken, refreshToken, profile, done) {
			var User = sequelize.daoFactoryManager.getDAO('User');
			User.find({where: {facebookId: profile.id}}).success(function(user) {
				if (!user) {
					User.create({
						facebookId: profile.id,
						name: profile.displayName
					}).success(function(user) {
						console.log('SUCCESS');
						return done(null, user);
					}).error(function(err) {
						console.log('ERROR');
						return done(err);
					})
				} else {
					if (!user.disabled) {
						console.log('foobar');
						return done(null, user);
					}
					return done('User disabled');
				}
			}).error(function(err) {
				return done(err);
			});
		}
	));

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		var User = sequelize.daoFactoryManager.getDAO('User');
		User.find(id).success(function(user) {
			done(null, user);
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