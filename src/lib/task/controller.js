/** Controller: Task.Controller
 * Task Controller
 */

var path = require('path')
	, validatorsPath = path.join('..', '..', 'shared', 'validators')
	, taskFormValidator = require(
		path.join(validatorsPath, 'task-form'))
	, moment = require('moment')

	, AVAILABLE_FIELDS = [
		'name', 'reward', 'dueDate'
	];


/** Function: index
 * Render list of tasks
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
exports.index = function index(req, res) {
	var community = res.locals.community;

	var order = parseInt(req.param('order'), 10) === 2 ? 'DESC' : 'ASC'
		, field = AVAILABLE_FIELDS.indexOf(req.param('field')) !== -1 ?
			req.param('field') : 'dueDate';

	community.getTasks({order: field + ' ' + order}).success(
		function result(tasks) {
			res.render('task/views/index', {
				newOrder: order === 'DESC' ? 1 : 2
				, currOrder: order
				, currField: field
				, title: res.__('Tasks')
				, tasks: tasks
			});
	});
};

/** Function: fresh
 * Render new task form
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
exports.fresh = function fresh(req, res) {
	var community = res.locals.community;

	return res.render('task/views/form', {
		title: res.__('New Task')
		, action: '/community/' + community.slug + '/task'
	});

};

/** PrivateFunction: errorHandler
 * Dummy error handler which just returns an internal server error.
 */
var errorHandler = (function errorHandler(res) {
	return function() {
		res.send(500);
	};
});

/** PrivateFunction: setCommunity
 * Sets community to a task and calls successCb on success.
 *
 * Parameters:
 *   (Task) task - Task to assign the community to
 *   (Community) community - Community to set to the task
 *   (Response) res - Response
 *   (Function) successCb - Success callback
 */
function setCommunity(task, community, res, successCb) {
	task.setCommunity(community)
		.success(successCb)
		.error(errorHandler(res));
}

/** PrivateFunction: setCreator
 * Sets creator of a task and calls successCb on success.
 *
 * Parameters:
 *   (Task) task - Task to assign the community to
 *   (Resident) creator - Creator of the task
 *   (Response) res - Response
 *   (Function) successCb - Success callback
 */
function setCreator(task, creator, res, successCb) {
	task.setCreator(creator)
		.success(function() {
			successCb();
		})
		.error(errorHandler(res));
}

/** PrivateFunction: createTaskInDatabase
 * Creates the task in the database using <Task> and calls next on success.
 *
 * Parameters:
 *   (Object) data - Task data
 *   (Sequelize) db - Database instance
 *   (Community) community - Community to add the task to
 *   (Resident) creator - Creator
 *   (Response) res - Response
 *   (Function) next - Next callback on success
 */
function createTaskInDatabase(data, db, community, creator, res, next) {
	var Task = db.daoFactoryManager.getDAO('Task');

	Task.create(data)
		.success(function createSuccess(task) {
			setCommunity(task, community, res, function() {
				setCreator(task, creator, res, function() {
					next(task);
				});
			});
		})
		.error(errorHandler(res));
}


/** PrivateFunction: createTask
 * Creates a task
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
function createTask(req, res) {
	var resident = req.user
		, community = res.locals.community
		, db = req.app.get('db');

	var taskData = {
		name: req.param('name')
		, description: req.param('description')
		, reward: req.param('reward')
		, dueDate: moment(req.param('dueDate')).toDate()
	};

	createTaskInDatabase(taskData, db, community, resident, res,
		function(task) {
			if (req.is('json')) {
				res.location('/community/' +
					community.slug + '/task/' + task.id);
				return res.send(201);
			}
			req.flash('success', res.__('Task successfully added.'));
			return res.redirect('.');
	});
}

/** Function: create
 * POST-target for <fresh> which will validate the form using
 * <taskFormValidator> and if successful, call <createTask>.
 */
exports.create = [taskFormValidator, createTask];

/** PrivateFunction: findAndCheckTaskAndCommunity
 * Finds task and it's community and checks if the logged-in resident has
 * access to it.
 * If yes, it will use the `next` param as a callback.
 * If no, it will return a proper http status code.
 *
 * Parameters:
 *   (Integer) taskId - Task id
 *   (String) slug - Community Slug
 *   (Resident) resident - Logged-In resident
 *   (Request) req - Request
 *   (Response) res - Response
 *   (Callback) next - Next callback
 */
function findAndCheckTaskAndCommunity(taskId, slug, resident, req, res, next) {
	var db = req.app.get('db')
		, Task = db.daoFactoryManager.getDAO('Task');

	Task.find(taskId)
		.success(function findResult(task) {
			if (!task) {
				return res.send(404);
			}

			task.getCommunity({ where: {slug: slug, id: task.CommunityId}})
				.success(function findCommunityResult(community) {
					if (!community) {
						return res.send(404);
					}

					if (resident.CommunityId !== community.id) {
						return res.send(405);
					}

					// successfully found everything, call the callback
					next(task, community);
				})
				.error(function findCommunityError() {
					return res.send(500);
				});
		})
		.error(function findTaskError() {
			return res.send(500);
		});
}

/** Function: check
 * Marks a task as done.
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
exports.check = function check(req, res) {
	var resident = req.user
		, taskId = req.params.id
		, slug = req.params.slug;

	findAndCheckTaskAndCommunity(taskId, slug, resident, req, res,
		function(task) {
			task.fulfilledAt = new Date();
			task.save()
				.success(function taskSaveSuccess() {
					task.setFulfillor(resident)
						.success(function setFulfillorResult() {
							req.app.get('eventbus')
								.trigger('task:done', resident, task);
							return res.redirect('../../');
						})
						.error(function setFulfillorError() {
							return res.send(500);
						});
				})
				.error(function taskSaveError() {
					return res.send(500);
				});
	});
};

/** Function: edit
 * Edit a task
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
exports.edit = function edit(req, res) {
	var resident = req.user
		, taskId = req.params.id
		, slug = req.params.slug;

	findAndCheckTaskAndCommunity(taskId, slug, resident, req, res,
		function(task, community) {
			if (task.isFulfilled()) {
				req.flash('error',
					res.__('Only not fulfilled tasks can be edited.'));
				return res;
			}
			return res.render('task/views/form', {
				title: res.__('Edit Task ' + task.id),
				task: task
				, action: '/community/' +
					community.slug + '/task/' + task.id + '/edit'
			});
	});
};

function updateTask(req, res) {
	var resident = req.user
		, taskId = req.params.id
		, slug = req.params.slug;

	findAndCheckTaskAndCommunity(taskId, slug, resident, req, res,
		function(task, community) {
			if (task.isFulfilled()) {
				req.flash('error',
					res.__('Only not fulfilled tasks can be edited.'));
				return res;
			}
			task.name = req.param('name');
			task.reward = req.param('reward');
			task.description = req.param('description');
			task.dueDate = moment(req.param('dueDate')).toDate();
			task.save()
				.success(function taskSaved() {
					if (req.is('json')) {
						return res.json(200, task);
					}
					req.flash('success', res.__('Task saved successfully.'));
					return res.redirect('/community/' +
						community.slug + '/task');
				})
				.error(function taskSaveError() {
					return res.send(500);
				});
	});
}

exports.update = [taskFormValidator, updateTask];

exports.del = function del(req, res) {
	var resident = req.user
		, taskId = req.params.id
		, slug = req.params.slug;

	findAndCheckTaskAndCommunity(taskId, slug, resident, req, res,
		function(task, community) {
			if (task.isFulfilled()) {
				if(req.is('json')) {
					return res.send(400);
				}
				req.flash('error',
					res.__('Only not fulfilled tasks can be edited.'));
				return res.redirect('/community/' + community.slug + '/task');
			}

			task.destroy()
				.success(function deletedTask() {
					if (req.is('json')) {
						return res.send(204);
					}
					req.flash('success', res.__('Task deleted successfully'));
					return res.redirect('/community/' +
						community.slug + '/task');
				})
				.error(function errorDeletingTask() {
					return res.send(500);
				});
	});
};