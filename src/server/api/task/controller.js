/** Controller: Api.Task.Controller
 * The Task API controller encapsulates logic for interacting with task domain
 * objects.
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
	debug('get task dao');

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
	debug('get community dao');

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
			success(task.dataValues);
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
							for(var i in tasks) {
								tasks[i] = tasks[i].dataValues;
							}

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
	debug('create task');

	var self = this
		, currentUser = self.req.user
		, community = self.req.community
		, taskDao = getTaskDao.call(self);

	taskDao.create(task)
		.success(function createResult(task) {
			task.setCommunity(community)
				.success(function ok() {
					task.setCreator(currentUser)
						.success(function ok(createdTask) {
							var createdTaskData = createdTask.dataValues;

							self.app.get('eventbus').emit(
								'task:created'
								, createdTaskData);
							success(createdTaskData);
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

/** Function: updateTask
 * Updates a task of a given community with the regarding taskId. The data
 * contained in updateData.
 *
 * Parameters:
 *     (Function) success - Callback if the task was updated correctly. The task
 *                          data will be returned.
 *     (Function) error - Callback in case of an error.
 *     (String) communitySlug - Slug of the community the task belongs to
 *     (Number) taskId - ID of the task to update
 *     (Object) updateData - An object containing the information about the task
 *                           to update.
 **/
function updateTask(success, error, communitySlug, taskId, updateData) {
	debug('update task');

	var taskDao = getTaskDao.call(this)
		, eventbus = this.app.get('eventbus')

		/* AnonymousFunction: forwardError
		 * Forwards an error object using the error callback argument
		 */
		, forwardError = function forwardError(err) {
			debug('forward error');
			return error(err);
		}

		/* AnonymousFunction: forwardError
		 * After searching the task matching the one from the input parameter,
		 * this function ensures that all necessary data is saved to the
		 * database.
		 */
		, afterTaskSearch = function afterTaskSearch(task) {
			debug('after task search');

			if(!task) {
				forwardError(new errors.NotFoundError('Task with id ' + taskId +
					'does not exist.'));
			}

			task.name = updateData.name || task.name;
			task.description = updateData.description || task.description;
			task.reward = updateData.reward || task.reward;
			task.fulfilledAt = updateData.fulfilledAt || task.fulfilledAt;
			task.dueDate = updateData.dueDate || task.dueDate;
			task.updatedAt = new Date();
			task.fulfillorId = updateData.fulfillorId || task.fulfillorId;

			task.save()
				.success(afterTaskSave)
				.error(forwardError);
		}

		/* AnonymousFunction: afterTaskSave
		 * Emits a "task:updated" event and calls the success callback argument.
		 */
		, afterTaskSave = function afterTaskSave(task) {
			debug('after task save');

			var taskData = task.dataValues;

			eventbus.emit('task:updated', taskData);
			success(taskData);
		};

	taskDao.find({ where: { id: taskId }})
		.success(afterTaskSearch)
		.error(forwardError);
}

module.exports = {
	getTaskWithId: getTaskWithId
	, getTasksForCommunityWithSlug: getTasksForCommunityWithSlug
	, createTask: createTask
	, updateTask: updateTask
};