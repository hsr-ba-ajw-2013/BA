/** Module: PassportMock
 * Mocks <PassportJs at http://passportjs.org> to be used in tests.
 */
var passport = require('passport')
	, StrategyMock = require('./strategy-mock')
	, utils = require('../utils');

/** Function: passportMock
 * Creates necessary configuration (<StrategyMock>) and routes (/mock/login)
 * in order to do a mocked login.
 *
 * Parameters:
 *   (Express) app - Express.js Application
 *   (Object) options - Options for <StrategyMock>
 */
function passportMock(app, options) {
	var db = app.get('db');
	passport.use(new StrategyMock(options,
		function createResident(resident, done) {
			var Resident = db.daoFactoryManager.getDAO('Resident');

			Resident.create(resident).success(function result(resident) {
				return done(null, resident);
			}).error(function(err) {
				return done(err);
			});
		})
	);

	app.get('/mock/login', passport.authenticate('mock', {
		successRedirect: '/login'
	}));
}
exports.passportMock = passportMock;

/** Function: doLogin
 * Logs a user in using <passportMock>. Returns the
 * super-request request with the session in it.
 *
 * Parameters:
 *   (Express) app - Instantiated application
 *   (Request) req - Instantiated super-request
 *   (Boolean) passAuthentication - [Optional, Default true]
 *                                   set to false if you wish that
 *                                   the authentication fails.
 *   (Object) user - User to create
 */
exports.doLogin = function doLogin(app, req, passAuthentication, user) {
	if (passAuthentication === undefined) {
		passAuthentication	= true;
	}
	user = user || {
		name: utils.randomString(16)
		, facebookId: Math.round(1000 * (Math.random() + 1)) *
			Math.round(1000 * (Math.random() + 1))
	};

	passportMock(app, {
		passAuthentication: passAuthentication,
		user: user
	});
	return req.get('/mock/login').end();
};