"use strict";

var expressLayouts = require('express-ejs-layouts');

module.exports = function(app, config) {
	app.use(expressLayouts);
};