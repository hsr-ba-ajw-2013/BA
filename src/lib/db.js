"use strict";

var Sequelize = require('sequelize')
	, path = require('path')
	, fs = require('fs');

module.exports = function init(config) {
	var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.options),
		modelPath = path.join(__dirname, '..', 'models');

	fs.readdirSync(modelPath).forEach(function(fileName) {
		sequelize.import(path.join(modelPath, fileName));
	});

	var Resident = sequelize.daoFactoryManager.getDAO('Resident'),
		Task = sequelize.daoFactoryManager.getDAO('Task'),
		Community = sequelize.daoFactoryManager.getDAO('Community');

	Resident.hasMany(Task, {as: 'creator', foreignKey: 'creatorId'});
	Resident.hasMany(Task, {as: 'fulfillor', foreignKey: 'fulfillorId'});

	Community.hasMany(Task);

	// write it to the db
	sequelize.sync();

	return sequelize;
};