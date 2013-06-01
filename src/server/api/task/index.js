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

	// POST /api/community/:slug/tasks
	api.post(prefix, [
		basicAuthentication
		, authorizedForCommunity
		, taskValidators.createTask
		, controller.createTask
	]);

	// POST /api/community/:slug/tasks/:id
	api.post(prefix + 's/:id', [
		basicAuthentication
		, authorizedForCommunity
		, taskValidators.createTask
		, controller.updateTask
	]);

	// POST /community/:slug/task
	// This makes the createTask API function accessible for old-scool form
	// submits
	api.app.post(modulePrefix, utils.buildFormRoute(
		function success(task, redirect) {
			redirect('/community/' + this.req.param('slug') + '/tasks');
		}
		, function error(err, redirect) {
			api.app.get('eventbus').emit('validation:error', err.message);
			redirect('/community/' + this.req.param('slug') + '/task/new');
		}
		, api
		, [
			basicAuthentication
			, authorizedForCommunity
			, taskValidators.createTask
			, controller.createTask
		]
	));

};
