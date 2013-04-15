/** Model: Task.Model
 * Task model
 */
var Sequelize = require('sequelize');


function createRelationships(app) {
	var db = app.get('db')
		, Resident = db.daoFactoryManager.getDAO('Resident')
		, Task = db.daoFactoryManager.getDAO('Task')
		, Community = db.daoFactoryManager.getDAO('Community');


	Task.belongsTo(Resident, {as: 'Creator', foreignKey: 'creatorId'});
	Task.belongsTo(Resident, {as: 'Fulfillor', foreignKey: 'fulfillorId'});
	Task.belongsTo(Community);
}

module.exports = function init(app) {
	var db = app.get('db');
	db.define('Task', {
		name: Sequelize.STRING
		, description: Sequelize.STRING
		, reward: Sequelize.INTEGER
		, fulfilledAt: Sequelize.DATE
		, dueDate: Sequelize.DATE
	} , {
		instanceMethods: {
			isFulfill: function() {
				return this.fulfilledAt !== null;
			}
		}
	});

	return createRelationships;
};
