/**
 * Task model
 */
"use strict";

var Sequelize = require('sequelize');

module.exports = function init(app, config) {
	var db = app.get('db');
	db.define('Task', {
		name: Sequelize.STRING
		, description: Sequelize.STRING
	});

	return createRelationships;
};

function createRelationships(app) {
	var db = app.get('db')
		, Resident = db.daoFactoryManager.getDAO('Resident')
		, Task = db.daoFactoryManager.getDAO('Task')
		, Community = db.daoFactoryManager.getDAO('Community');


	Task.belongsTo(Resident, {as: 'creator'});
	Task.belongsTo(Resident, {as: 'fulfillor'});
	Task.belongsTo(Community);
}