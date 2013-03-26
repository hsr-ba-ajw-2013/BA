var Sequelize = require('sequelize');

module.exports = function init(app, config) {
	app.set('db', new Sequelize(
		config.db.database
		, config.db.username
		, config.db.password
		, config.db.options)
	);
};