"use strict";

var Sequelize = require('sequelize')
	, path = require('path')
	, fs = require('fs');

module.exports = function init(app, config) {
	app.set('db', new Sequelize(config.db.database, config.db.username, config.db.password, config.db.options));
};