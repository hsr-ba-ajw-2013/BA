"use strict";

var Schema = require('jugglingdb').Schema;

module.exports = function init(config) {
	var schema = new Schema(config.db.type, config.db.options)
		, Community = require('./community')(schema)
		, Task = require('./task')(schema)
		, User = require('./user')(schema);

	require('./relationships')(Community, Task, User);

	return schema;
};