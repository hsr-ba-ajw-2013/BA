/** Controller: Api.Task.Controller
 * Task Controller
 */

var errors = require('./errors')
	, debug = require('debug')('roomies:api:task:controller')
	, _  = require('underscore');

/** PrivateFunction: getTaskDao
 * Shortcut function to get the data access object for task entities.
 *
 * Returns:
 *     (Object) sequelize data access object for task entities.
 */
function getTaskDao() {
	var db = this.app.get('db')
		, taskDao = db.daoFactoryManager.getDAO('Task');

	return taskDao;
}

/** PrivateFunction: getCommunityDao
 * Shortcut function to get the data access object for community entities.
 *
 * Returns:
 *     (Object) sequelize data access object for community entities.
 */
function getCommunityDao() {
	var db = this.app.get('db')
		, communityDao = db.daoFactoryManager.getDAO('Community');

	return communityDao;
}

/** Function: getTaskWithId
 * Looks up a task with a specific task id.
 *
 * Parameters:
 *     (Function) success - A callback function called on success. The first
 *                          parameter will contain the task data.
 *     (Function) error - The error callback function. First argument will be
 *                        the error object itself.
 *     (Number) taskId - The id of the task to look up
 */
function getTaskWithId(success, error, taskId) {
	debug('get task with id `%i`', taskId);
	var taskDao = getTaskDao.call(this)
		, self = this;

	taskDao.find({ where: { id: taskId } })
		.success(function ok(task) {
			if(!task) {
				return error(new errors.NotFoundError('Task with id ' + taskId +
					'does not exist.'));
			}
			if(task.CommunityId !== self.req.user.CommunityId) {
				return error(new errors.ForbiddenError('Task with id "' +
					task.id + '" is in a different community.'));
			}
			success(task);
		})
		.error(function nok(err) {
			error(err);
		});
}

/** Function: getTasksForCommunityWithSlug
 * Returns all tasks for the community with the given slug. In case the
 * community slug was not found or the given community does not have any tasks
 * assigned at the moment, a NotFoundError gets returned.
 *
 * Parameters:
 *   (Function) success - Callback on success. Will pass the tasks as first
 *                        argument.
 *   (Function) error - Callback in case of an error
 *   (String) slug - The slug of the community to look for.
 */
function getTasksForCommunityWithSlug(success, error, slug) {
	debug('get tasks for community with slug');
	var communityDao = getCommunityDao.call(this)
		, self = this;
	communityDao.find({ where: { slug: slug, enabled: true }})
		.success(function findCommunity(community) {
			if(!_.isNull(community)) {
				if(community.id !== self.req.user.CommunityId) {
					return error(
						new errors.ForbiddenError('Invalid Community'));
				}
				community.getTasks({ order: 'id DESC' })
					.success(function findTasks(tasks) {
						if(!_.isNull(tasks) && tasks.length > 0) {
							success(tasks);
						} else {
							error(new errors.NoTasksFoundError(
								'No tasks found for community with slug `' +
								slug + '`.'));
						}
					})
					.error(function daoError(err) {
						error(err);
					});
			} else {
				error(new errors.NotFoundError('Community with slug ' + slug +
					'does not exist.'));
			}
		})
		.error(function daoError(err) {
			error(err);
		});
}


/** Function: createTask
 * Creates a new task using the passed information.
 *
 * Parameters:
 *     (Function) success - Callback if the task was created correctly. The task
 *                          data will be returned.
 *     (Function) error - Callback in case of an error.
 *     (Object) task - An object containing the information about the task to
 *                     create.
 */
function createTask(success, error, communitySlug, task) {
	var self = this
		, currentUser = self.req.user
		, community = self.req.community;
	var taskDao = getTaskDao.call(self);
	taskDao.create(task)
		.success(function createResult(task) {
			task.setCommunity(community)
				.success(function ok() {
					task.setCreator(currentUser)
						.success(function ok() {
							self.app.get('eventbus').emit('task:created'
								, task);
							success('/community/' + community.slug +
								'/tasks');
						})
						.error(function nok(err) {
							error(err);
						});
				})
				.error(function nok(err) {
					error(err);
				});
		}).error(function nok(err) {
			error(err);
		}
	);
}

function updateTask(/*success, error, task*/) {
	//var taskDao = getTaskDao.call(this);
}

module.exports = {
	getTaskWithId: getTaskWithId
	, getTasksForCommunityWithSlug: getTasksForCommunityWithSlug
	, createTask: createTask
	, updateTask: updateTask
};