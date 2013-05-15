/** Module: Database
 * Initializes <sequelize at http://sequelizejs.com/> with all application
 * entities.
 */

var Sequelize = require('sequelize');

/** Function: setupDatabase
 * Initializes the sequelize ORM adapter and ensures that it is available via
 * the express.js app serverwide.
 *
 * Parameters:
 *   (Object) app - Initialized express application
 *   (Object) config - Configuration
 *   (Function) done - In case that any code really needs to wait until the db
 *                     is synced.
 */
function setupDatabase(app, config, done) {
	var db = new Sequelize(
		config.db.database
		, config.db.username
		, config.db.password
		, config.db.options
	);

	// unit testing made easier
	if (app) {
		app.set('db', db);
	}

	var setupCommunityEntity = require('./community')(app, db)
		, setupResidentEntity = require('./resident')(app, db)
		, setupTaskEntity = require('./task')(app, db)
		, setupAchievementEntity = require('./achievement')(app, db);

	setupCommunityEntity(app, db);
	setupResidentEntity(app, db);
	setupTaskEntity(app, db);
	setupAchievementEntity(app, db);

	// if done is not given, just place an empty function.
	done = done || function() {};

	db.sync().success(function() {
		done(null, db);
	}).error(function(err) {
		done(err);
	});

	return db;
}

module.exports = setupDatabase;