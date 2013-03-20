"use strict";

var express = require('express');

module.exports = function(app, config) {
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.cookieParser());
	app.use(express.session({ secret: config.sessionSecret }));
};