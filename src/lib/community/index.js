"use strict";

var controller = require('./controller')
	, model = require('./model')
	, path = require('path');

module.exports = function(app, config) {
	controller(app);

	return model(app);
};