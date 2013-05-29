/** Component: Api.Task
 * Task API Component
 */

var controller = require('./controller')
	, basicAuthentication = require('../policy/basicAuthentication')
	, authorizedForCommunity = require('../policy/authorizedForCommunity')
	, taskValidators = require('./validators')
	, utils = require('../utils')
	, modulePrefix = '/community/:slug/task';

module.exports = function initTaskApi(api, apiPrefix) {
	var prefix = apiPrefix + modulePrefix;

	api.get(prefix + '/:id', [
		basicAuthentication
		, taskValidators.createTask
		, controller.getTaskWithId]);

	// GET /api/community/:slug/tasks
	api.get(prefix + 's', [
		basicAuthentication
		, authorizedForCommunity
		, controller.getTasksForCommunityWithSlug]);

	// POST /community/:slug/task
	api.app.post(modulePrefix, utils.buildFormRoute(
		modulePrefix + 's', modulePrefix + '/new', api, [
			basicAuthentication
			, authorizedForCommunity
			, taskValidators.createTask
			, controller.createTask
		]
	));
	// POST /api/community/:slug/tasks
	api.post(prefix, [
		basicAuthentication
		, authorizedForCommunity
		, taskValidators.createTask
		, controller.createTaskForCommunityWithSlug
	]);
};

/*
var controller = require('./controller')
	, model = require('./model')
	, path = require('path')
	, loginRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'login-required')
	)
	, communityRequired = require(path.join(
		'..', '..', 'shared', 'policies', 'community-required')
	)
	, communityIsActive = require(path.join(
		'..', '..', 'shared', 'policies', 'community-isactive')
	)
	, COMMUNITY_PREFIX = '/community/:slug'
	, TASK_PREFIX = COMMUNITY_PREFIX + '/task';

/** Function: taskInit
 * Initializes Task URLs
 *
 * Parameters:
 *   (Express) app - Initialized express application
 *
 * Returns:
 *   (Function) function to initialize relationships after creating all models.
 *
module.exports = function taskInit(app) {
	/**
	 * /community/:slug/tasks GET -- index
	 *							POST -- create
	 *		/new -- fresh (new is protected word)
	 *		/:id GET -- get
	 *				PUT -- update
	 *				DELETE -- del
	 *

	app.all(TASK_PREFIX, loginRequired, communityRequired, communityIsActive);

	app.get(TASK_PREFIX, controller.index);
	app.post(TASK_PREFIX, controller.create);

	app.get(TASK_PREFIX + '/new', controller.fresh);

	app.put(TASK_PREFIX + '/:id', controller.update);
	app.del(TASK_PREFIX + '/:id', controller.del);

	//TODO: is GET the way to go?
	app.get(TASK_PREFIX + '/:id/check', controller.check);

	app.get(TASK_PREFIX + '/:id/edit', controller.edit);
	// PUT/POST to update
	app.post(TASK_PREFIX + '/:id/edit', controller.update);

	return model(app);
};*/