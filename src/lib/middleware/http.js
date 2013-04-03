
var express = require('express')
	, SequelizeStore = require('connect-session-sequelize')(express);

module.exports = function httpInit(app, config) {
	app.use(express.bodyParser());

	app.use(express.cookieParser());
	app.use(express.session({
		store: new SequelizeStore({
			db: app.get('db')
		})
		, secret: config.sessionSecret
	}));

	app.use(express.methodOverride());
};