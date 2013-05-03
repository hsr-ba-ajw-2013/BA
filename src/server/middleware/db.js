/** Module: Database
 * Initializes <sequelize at http://sequelizejs.com/>.
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
	app.set('db', new Sequelize(
		config.db.database
		, config.db.username
		, config.db.password
		, config.db.options)
	);
}

module.exports = setupDatabase;