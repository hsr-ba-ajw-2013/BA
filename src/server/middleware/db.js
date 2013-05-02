/** Module: Database
 * Initializes <sequelize at http://sequelizejs.com/>.
 */

var Sequelize = require('sequelize');

/** Function: dbInit
 * Initializes the database and sets it to the application-wide 'db' parameter.
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *   (Object) config - Configuration
 */
module.exports = function dbInit(app, config) {
	app.set('db', new Sequelize(
		config.db.database
		, config.db.username
		, config.db.password
		, config.db.options)
	);
};