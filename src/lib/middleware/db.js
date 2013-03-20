"use strict";

var Sequelize = require('sequelize')
	, path = require('path')
	, fs = require('fs');

module.exports = function init(app, config) {
	var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.options),
		componentPath = path.join(config.srcDir, 'lib');

	// TODO: Might be better to define models in each component
	fs.readdirSync(componentPath).forEach(function(componentDirectory) {
		var modelPath = path.join(componentPath, componentDirectory, 'model.js');
		if (fs.existsSync(modelPath)) {
			sequelize.import(modelPath);
		}
	});

	var Resident = sequelize.daoFactoryManager.getDAO('Resident'),
		Task = sequelize.daoFactoryManager.getDAO('Task'),
		Community = sequelize.daoFactoryManager.getDAO('Community');

	Resident.hasMany(Task, {as: 'creator', foreignKey: 'creatorId'});
	Resident.hasMany(Task, {as: 'fulfillor', foreignKey: 'fulfillorId'});
	Resident.belongsTo(Community);

	Task.belongsTo(Resident, {as: 'creator'});
	Task.belongsTo(Resident, {as: 'fulfillor'});
	Task.belongsTo(Community);

	Community.hasMany(Task);
	Community.hasOne(Resident);

	// write it to the db
	sequelize.sync();

	app.set('db', sequelize);
};