/** Model: Task.Model
 * Task model
 */
var Sequelize = require('sequelize');


function createRelationships(app) {
	var db = app.get('db')
		, Resident = db.daoFactoryManager.getDAO('Resident')
		, Task = db.daoFactoryManager.getDAO('Task')
		, Community = db.daoFactoryManager.getDAO('Community');


	Task.belongsTo(Resident, {as: 'creator'});
	Task.belongsTo(Resident, {as: 'fulfillor'});
	Task.belongsTo(Community);
}

module.exports = function init(app) {
	var db = app.get('db');
	db.define('Task', {
		name: Sequelize.STRING
		, description: Sequelize.STRING
		, fullfilledAt: Sequelize.DATE
	});

	return createRelationships;
};
