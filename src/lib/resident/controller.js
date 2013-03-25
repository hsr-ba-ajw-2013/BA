/**
 * Resident Controller
 */
"use strict";

var PREFIX = '/resident'
	, path = require('path')
	, loginRequired = require(path.join(
		'../../shared/policies/login-required')
	);

module.exports = function(app) {
	app.all(PREFIX + '*', loginRequired);
};
