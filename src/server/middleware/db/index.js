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
 */
function setupDatabase(app, config) {
	var db = new Sequelize(
		config.db.database
		, config.db.username
		, config.db.password
		, config.db.options
	);

	app.set('db', db);

	var setupCommunityEntity = require('./community')(app)
		, setupResidentEntity = require('./resident')(app)
		, setupTaskEntity = require('./task')(app);

	setupCommunityEntity(app, db);
	setupResidentEntity(app);
	setupTaskEntity(app);
	//rankRelationships(app);

	db.sync(); // Write the entity definitions down to the database:
}

module.exports = setupDatabase;