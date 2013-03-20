"use strict";

var express = require('express');

module.exports = function(app, config) {
	app.use(express.errorHandler());
};