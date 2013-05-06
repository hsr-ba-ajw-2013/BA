/** Model: Resident.Model
 * Resident model
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
		, Community = db.daoFactoryManager.getDAO('Community')
		, Achievement = db.daoFactoryManager.getDAO('Achievement');

	Resident.hasMany(Task, {as: 'createdTasks', foreignKey: 'creatorId'});
	Resident.hasMany(Task, {as: 'fulfilledTasks', foreignKey: 'fulfillorId'});
	Resident.hasMany(Achievement);
	Resident.belongsTo(Community);
}


/** Function: init
 * Initialize resident model
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
	db.define('Resident', {
		facebookId: {
			type: Sequelize.BIGINT
			, unique: true
		}
		, name: Sequelize.STRING
		, enabled: {
			type: Sequelize.BOOLEAN
			, allowNull: false
			, defaultValue: true
		}
	}
	, {
		instanceMethods: {
			isInACommunity: function() {
				return this.CommunityId !== null;
			}
		}
	});

	return createRelationships;
};
