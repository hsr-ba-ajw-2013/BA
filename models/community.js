"use strict";

/**
 * Community model
 */
 var Schema = require('jugglingdb').Schema;

module.exports = function init(schema) {
	var Community = schema.define('Community', {
		name: { type: String, length: 255 }
		, createdAt: { type: Date, default: Date.now }
		, updatedAt: { type: Date, default: Date.now }
	});

	return Community;
};