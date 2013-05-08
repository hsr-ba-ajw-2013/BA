/** Model: Community.Model
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
		, Resident = db.daoFactoryManager.getDAO('Resident')
		, Task = db.daoFactoryManager.getDAO('Task')
		, Community = db.daoFactoryManager.getDAO('Community');

	Community.hasMany(Task);
	Community.hasMany(Resident);
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
	db.define('Community', {
		name: Sequelize.STRING
		, shareLink: {type: Sequelize.STRING, unique: true}
		, slug: {type: Sequelize.STRING, unique: true}
	});

	return createRelationships;
};
