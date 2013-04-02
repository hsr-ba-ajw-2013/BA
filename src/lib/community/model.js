"use strict";

/** Model: Community.Model
 * The actual Community domain object model.
 */
var Sequelize = require('sequelize');

/** PrivateFunction: createRelationships
 * Creates the relationship information for this model.
 *
 * Parameters:
 *     (Express) app - An Express.JS application instance
 */
function createRelationships(app) {
	var db = app.get('db')
		, Resident = db.daoFactoryManager.getDAO('Resident')
		, Task = db.daoFactoryManager.getDAO('Task')
		, Community = db.daoFactoryManager.getDAO('Community');

	Community.hasMany(Task);
	Community.hasMany(Resident);
}

module.exports = function init(app) {
	var db = app.get('db');
	db.define('Community', {
		name: Sequelize.STRING
		, shareLink: {type: Sequelize.STRING, unique: true}
	});

	return createRelationships;
};
