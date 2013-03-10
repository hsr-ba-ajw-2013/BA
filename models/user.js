"use strict";

/**
 * User model
 */
 var Schema = require('jugglingdb').Schema;

module.exports = function init(schema) {
	var User = schema.define('User', {
		name: { type: String, length: 255 }
		, createdAt: { type: Date, default: Date.now }
		, updatedAt: { type: Date, default: Date.now }
	});

	return User;
};