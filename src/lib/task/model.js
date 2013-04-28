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
function createRelationships(app) {
	var db = app.get('db')
		, Resident = db.daoFactoryManager.getDAO('Resident')
		, Task = db.daoFactoryManager.getDAO('Task')
		, Community = db.daoFactoryManager.getDAO('Community');


	Task.belongsTo(Resident, {as: 'Creator', foreignKey: 'creatorId'});
	Task.belongsTo(Resident, {as: 'Fulfillor', foreignKey: 'fulfillorId'});
	Task.belongsTo(Community);
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
		, fulfilledAt: Sequelize.DATE
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
