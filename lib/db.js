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

	var User = sequelize.daoFactoryManager.getDAO('User'),
		Task = sequelize.daoFactoryManager.getDAO('Task'),
		Community = sequelize.daoFactoryManager.getDAO('Community');

	User.hasMany(Task, {as: 'creator', foreignKey: 'creator_id'});
	User.hasMany(Task, {as: 'fulfillor', foreignKey: 'fulfillor_id'});

	Community.hasMany(Task);

	// write it to the db
	sequelize.sync();

	return sequelize;
};