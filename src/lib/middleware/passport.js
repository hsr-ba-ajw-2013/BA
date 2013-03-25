/**
 * Passport configuration
 */

var passport = require('passport')
	, FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(app, config) {
	var db = app.get('db');

	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID
			, clientSecret: config.facebook.clientSecret
			, callbackURL: config.facebook.callbackUrl
		},
		function findOrCreate(accessToken, refreshToken, profile, done) {
			var Resident = db.daoFactoryManager.getDAO('Resident');

			Resident.find({where: {facebookId: profile.id}})
				.success(function(resident) {
					if (!resident) {
						Resident.create({
							facebookId: profile.id,
							name: profile.displayName
						}).success(function(resident) {
							return done(null, resident);
						}).error(function(err) {
							return done(err);
						});
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
		)
	);

	passport.serializeUser(function(resident, done) {
		done(null, resident.id);
	});

	passport.deserializeUser(function(id, done) {
		var Resident = db.daoFactoryManager.getDAO('Resident');
		Resident.find(id).success(function(resident) {
			if(!resident) {
				return done("Resident not found");
			}
			return done(null, resident);
		}).error(function(err) {
			console.log(err);
			done(err);
		});
	});

	app.use(function(req, res, next) {
		// assign user to the template
		res.locals.user = req.user;
		next();
	});

	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/community'
		, failureRedirect: '/'
		, failureFlash: true
	}));

	app.set('passport', passport);


	return app;
};