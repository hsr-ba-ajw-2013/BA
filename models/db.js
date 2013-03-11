"use strict";

var Schema = require('jugglingdb').Schema
	, resource = require('express-resource')
	, resourceJuggling = require('resource-juggling');

module.exports = function init(app, config) {
	var schema = new Schema(config.db.type, config.db.options)
		, Community = require('./community')(schema)
		, Task = require('./task')(schema)
		, User = require('./user')(schema);

	require('./relationships')(Community, Task, User);

	app.resource('community', resourceJuggling.getResource({
		schema: schema
		, name: 'Community'
		, model: Community
		, base: '/api/'
	}));
	app.resource('task', resourceJuggling.getResource({
		schema: schema
		, name: 'Task'
		, model: Task
		, base: '/api/'
	}));
	app.resource('user', resourceJuggling.getResource({
		schema: schema
		, name: 'User'
		, model: User
		, base: '/api/'
	}));

	return schema;
};