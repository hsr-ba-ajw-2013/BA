"use strict";

/**
 * Community model
 */
var Sequelize = require('sequelize');

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
	});

	return createRelationships;
};
