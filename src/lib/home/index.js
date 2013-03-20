"use strict";

var controller = require('./controller')
	, path = require('path');

module.exports = function(app, config) {
	controller(app);

	return;
};