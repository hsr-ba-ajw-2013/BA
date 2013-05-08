/** Model: Gamification.Model
 * The actual Community domain object model.
 */
var Sequelize = require('sequelize');

/** PrivateFunction: createRelationships
 * Creates the relationship information for this model.
 *
 * Parameters:
 *     (Express) app - An Express.js application instance
 */
function createRelationships(app) {
	var db = app.get('db')
		, Achievement = db.daoFactoryManager.getDAO('Achievement')
		, Resident = db.daoFactoryManager.getDAO('Resident');
	Achievement.belongsTo(Resident);
}

/** Function: init
 * Initialize community model
 *
 * Parameters:
 *   (Express) app - An Express.js application instance
 *   (Sequelize) db - Sequelize instance
 *
 * Returns:
 *   (Function) - <createRelationships> to initiate relationships after all
 *                 required models have been instantiated.
 */
module.exports = function init(app, db) {
	db = app ? app.get('db') : db;

	var ids = require('./achievements').identifiers();
	db.define('Achievement', {
		'type': Sequelize.ENUM.apply(Sequelize.ENUM, ids)
	});

	return createRelationships;
};
