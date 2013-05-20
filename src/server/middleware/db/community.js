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
function createRelationships(app, db) {
	db = app ? app.get('db') : db;
	var residentDao = db.daoFactoryManager.getDAO('Resident')
		, taskDao = db.daoFactoryManager.getDAO('Task')
		, communityDao = db.daoFactoryManager.getDAO('Community');

	communityDao.hasMany(taskDao);
	communityDao.hasMany(residentDao);
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
		, enabled: {
			type: Sequelize.BOOLEAN
			, allowNull: false
			, defaultValue: true
		}
	});

	return createRelationships;
};
