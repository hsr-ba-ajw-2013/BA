"use strict";

/**
 * Task model
 */
 var Schema = require('jugglingdb').Schema;

module.exports = function init(schema) {
	var Task = schema.define('Task', {
		name: { type: String, length: 255 }
		, description: { type: Schema.Text }
		, createdAt: { type: Date, default: Date.now }
		, updatedAt: { type: Date, default: Date.now }
	});

	return Task;
}