/** Component: Api.Task
 * Task API Component
 */

var controller = require('./controller')
	, basicAuthentication = require('../policy/basicAuthentication')
	, authorizedForCommunity = require('../policy/authorizedForCommunity')
	, taskValidators = require('./validators')
	, utils = require('../utils')
	, modulePrefix = '/community/:slug/tasks';

module.exports = function initTaskApi(api, apiPrefix) {
	var prefix = apiPrefix + modulePrefix;

	api.get(prefix + '/:id', [
		basicAuthentication
		, taskValidators.createTask
		, controller.getTaskWithId]);

	// GET /api/community/:slug/tasks
	api.get(prefix, [
		basicAuthentication
		, authorizedForCommunity
		, controller.getTasksForCommunityWithSlug]);

	var createTaskCallbacks = [
		basicAuthentication
		, authorizedForCommunity
		, taskValidators.createTask
		, controller.createTask
	];
	var updateTaskCallbacks = [
		basicAuthentication
		, authorizedForCommunity
		, taskValidators.createTask
		, controller.updateTask
	];

	// POST /api/community/:slug/tasks
	api.post(prefix, createTaskCallbacks);

	// POST /api/community/:slug/tasks/:id
	api.put(prefix + '/:id', updateTaskCallbacks);

	// POST /community/:slug/task
	// This makes the createTask API function accessible for old-scool form
	// submits
	api.app.post(modulePrefix, utils.buildFormRoute(
		function success(task, redirect) {
			redirect('/community/' + this.req.param('slug') + '/tasks');
		}
		, function error(err, redirect) {
			api.app.get('eventbus').emit('validation:error', err.message);
			redirect('/community/' + this.req.param('slug') + '/tasks/new');
		}
		, api
		, createTaskCallbacks
	));

	// POST /community/:slug/task
	// This makes the createTask API function accessible for old-scool form
	// submits
	api.app.put(modulePrefix + '/:id', utils.buildFormRoute(
		function success(task, redirect) {
			redirect('/community/' + this.req.param('slug') + '/tasks');
		}
		, function error(err, redirect) {
			api.app.get('eventbus').emit('validation:error', err.message);
			redirect('/community/' + this.req.param('slug') + '/tasks/');
		}
		, api
		, updateTaskCallbacks
	));

};
