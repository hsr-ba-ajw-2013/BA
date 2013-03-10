"use strict";

/**
 * Define relationships here to prevent cyclic dependencies
 */
module.exports = function init(Community, User, Task) {

	// Task < * --- 1 > Community
	Task.belongsTo(Community, {as: 'community', foreignKey: 'communityId'});
	Community.hasMany(Task, {as: 'tasks', foreignKey: 'communityId'});

	// User < * --- 1 > Community
	User.belongsTo(Community, {as: 'community', foreignKey: 'communityId'});
	Community.hasMany(User, {as: 'users', foreignKey: 'communityId'});

	// User < 1 --- * > Task
	Task.belongsTo(User, {as: 'creator', foreignKey: 'userId'});
	User.hasMany(Task, {as: 'createdTasks', foreignKey: 'userId'});
};