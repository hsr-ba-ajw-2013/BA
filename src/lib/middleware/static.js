"use strict";

var express = require('express'),
	path = require('path');

module.exports = function(app, config) {
	app.use(express.static(path.join(config.srcDir, 'public')));
};