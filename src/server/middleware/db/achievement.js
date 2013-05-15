/** Model: Achievement
 * The Achievement domain object model used for the gamification
 * component.
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
	var Achievement = db.daoFactoryManager.getDAO('Achievement')
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

	var ids = require('../../api/gamification/achievements').identifiers();
	db.define('Achievement', {
		'type': {
			type: Sequelize.STRING
			, validate: {
				isValidIdentifier: function(value) {
					if(ids.indexOf(value) === -1) {
						throw new Error("Invalid identifier '" +
							value + "' for type.");
					}
					return true;
				}
			}
		}
	});

	return createRelationships;
};