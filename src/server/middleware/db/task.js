/** Model: Task.Model
 * Task model
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


	taskDao.belongsTo(residentDao, {as: 'Creator', foreignKey: 'creatorId'});
	taskDao.belongsTo(residentDao, {as: 'Fulfillor', foreignKey: 'fulfillorId'});
	taskDao.belongsTo(communityDao);
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
	db.define('Task', {
		name: Sequelize.STRING
		, description: Sequelize.STRING
		, reward: Sequelize.INTEGER
		, fulfilledAt: {
			type: Sequelize.DATE
			, allowNull: true
		}
		, dueDate: Sequelize.DATE
	} , {
		instanceMethods: {
			isFulfilled: function() {
				return this.fulfilledAt !== null;
			}
		}
	});

	return createRelationships;
};
