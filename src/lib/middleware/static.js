
var express = require('express'),
	path = require('path');

module.exports = function staticInit(app, config) {
	app.use(express.static(path.join(config.srcDir, 'public')));
};