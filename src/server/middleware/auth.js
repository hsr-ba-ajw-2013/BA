/** Module: Auth
 * Provides authentication services using <Passport at http://passportjs.org/>.
 *
 * For the moment, authentication with the <FacebookStrategy at
 * http://passportjs.org/guide/facebook/> is implemented. The following routes
 * are added to your Express.JS application during setup:
 * * /auth/facebook
 * * /auth/facebook/callback
 */

var passport = require('passport')
	, FacebookStrategy = require('passport-facebook').Strategy
	, _ = require('underscore');

/** Function: setupAuth
 * Initialize the Passport authentication provider and its Facebook strategy.
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *   (Object) config - Configuration
 */
function setupAuth(app, config) {
	var db = app.get('db');

	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID
			, clientSecret: config.facebook.clientSecret
			, callbackURL: config.facebook.callbackUrl
		},
		function findOrCreate(accessToken, refreshToken, profile, done) {
			var residentDao = db.daoFactoryManager.getDAO('Resident');

			residentDao.find({ where: { facebookId: profile.id } })
				.success(function result(resident) {
					if (_.isNull(resident)) {
						residentDao.create({
								facebookId: profile.id
								, name: profile.displayName
							})
							.success(function residentCreated(resident) {
								return done(null, resident);
							})
							.error(function errorCreatingResident(err) {
								return done(err);
							});
					} else {
						if(resident.enabled) {
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

		Resident.find(id)
			.success(function result(resident) {
				if(_.isNull(resident)) {
					return done('Resident not found');
				}
				return done(null, resident);
			})
			.error(function error(err) {
				console.log(err);
				done(err);
			});
	});

	app.use(function assignUserAndCommunity(req, res, next) {
		var user = req.user;

		if(user && user.CommunityId) {
			var communityDao = db.daoFactoryManager.getDAO('Community');

			communityDao.find({ where: { id: user.CommunityId } })
				.success(function findResult(community) {
					if(!_.isNull(community)) {
						req.community = community;
					}
					next();
				})
				.error(function daoError() {
					next();
				});
		} else {
			next();
		}
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
}

module.exports = setupAuth;