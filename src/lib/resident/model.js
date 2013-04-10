/** Model: Resident.Model
 * Resident model
 */
var Sequelize = require('sequelize');

function createRelationships(app) {
	var db = app.get('db')
		, Resident = db.daoFactoryManager.getDAO('Resident')
		, Task = db.daoFactoryManager.getDAO('Task')
		, Community = db.daoFactoryManager.getDAO('Community');

	Resident.hasMany(Task, {as: 'creator', foreignKey: 'creatorId'});
	Resident.hasMany(Task, {as: 'fulfillor', foreignKey: 'fulfillorId'});
	Resident.belongsTo(Community);
}

module.exports = function init(app) {
	var db = app.get('db');
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
