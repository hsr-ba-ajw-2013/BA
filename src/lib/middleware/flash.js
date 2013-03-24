"use strict";

var flash = require('connect-flash');

module.exports = function(app, config) {
	app.use(flash());
};