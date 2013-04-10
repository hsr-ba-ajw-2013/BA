/**
 * Passport configuration
 */

var passport = require('passport')
	, FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function passportInit(app, config) {
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
				.success(function result(resident) {
					if (!resident) {
						Resident.create({
							facebookId: profile.id,
							name: profile.displayName
						}).success(function residentCreated(resident) {
							return done(null, resident);
						}).error(function errorCreatingResident(err) {
							return done(err);
						});
					} else {
						if (resident.enabled) {
							return done(null, resident);
						}
						return done('User disabled');
					}
				}).error(function error(err) {
					return done(err);
				});
			}
		)
	);

	passport.serializeUser(function serializeUser(resident, done) {
		done(null, resident.id);
	});

	passport.deserializeUser(function deserializeUser(id, done) {
		var Resident = db.daoFactoryManager.getDAO('Resident');
		Resident.find(id).success(function result(resident) {
			if(!resident) {
				return done("Resident not found");
			}
			return done(null, resident);
		}).error(function error(err) {
			console.log(err);
			done(err);
		});
	});

	app.use(function assignUser(req, res, next) {
		// assign user to the template
		res.locals.user = req.user;
		next();
	});

	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback', function(req, res, next) {
		passport.authenticate('facebook', function(err, user){
			var redirectUrl = '/community';

			if (err) {
				console.log("err", err);
				return next(err);
			}

			if (!user) {
				return res.redirect('/');
			}

			if (req.session.redirectUrl) {
				redirectUrl = req.session.redirectUrl;
				req.session.redirectUrl = null;
			}

			req.logIn(user, function(err){
				if (err) {
					return next(err);
				}
			});

			res.redirect(redirectUrl);
		})(req, res, next);
	});

	app.set('passport', passport);


	return app;
};