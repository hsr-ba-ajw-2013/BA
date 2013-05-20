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
function createRelationships(app, db) {
	db = app ? app.get('db') : db;
	var residentDao = db.daoFactoryManager.getDAO('Resident')
		, taskDao = db.daoFactoryManager.getDAO('Task')
		, communityDao = db.daoFactoryManager.getDAO('Community')
		, achievementDao = db.daoFactoryManager.getDAO('Achievement');

	residentDao.hasMany(taskDao, {
		as: 'createdTasks'
		, foreignKey: 'creatorId'
	});
	residentDao.hasMany(taskDao, {
		as: 'fulfilledTasks'
		, foreignKey: 'fulfillorId'
	});
	residentDao.hasMany(achievementDao);
	residentDao.belongsTo(communityDao);
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
		, isAdmin: {
			type: Sequelize.BOOLEAN
			, allowNull: false
			, defaultValue: false
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
