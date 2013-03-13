/**
 * Passport configuration
 */

module.exports = function(config, schema) {
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
			var User = schema.models.User;
			User.findOne({where: {facebookId: profile.id, active: true}}, function(err, user) {
				if(err !== null) {
					return done(err);
				}
				if(user === null) {
					var user = new User({
						facebookId: profile.id,
						name: profile.displayName
					});
					user.save(function(err, foobar) {
						if (err !== null) {
							return done(err);
						}
						done(null, user);
					});
				} else {
					return done(null, user);
				}
			});
		}
	));

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		var User = schema.models.User;
		User.find(id, function(err, user) {
			done(err, user);
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