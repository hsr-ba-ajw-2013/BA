/**
 * Define relationships here to prevent cyclic dependencies
 */

var Task = require('./task')
	, User = require('./user')
	, Community = require('./community');

// User < 1 --- * > Task
User.hasMany(Task, {as: 'tasks', foreignKey: 'userId'});
Task.belongsTo(User, {as: 'creator', foreignKey: 'userId'});
Task.belongsTo(User, {as: 'fulfiller', foreignKey: 'userId'});

// Task < * --- 1 > Community
Community.hasMany(Task, {as: 'tasks', foreignKey: 'communityId'});
Task.belongsTo(Community, {as: 'belongsTo', foreignKey: 'communityId'});

// User < * --- 1 > Community
Community.hasMany(User, {as: 'users', foreignKey: 'communityId'});
User.belongsTo(User, {as: 'belongsTo', foreignKey: 'communityId'});