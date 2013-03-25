"use strict";

var controller = require('./controller')
	, model = require('./model');

module.exports = function(app) {
	controller(app);

	return model(app);
};