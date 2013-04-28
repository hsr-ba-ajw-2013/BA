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
	var resident = req.user;

	resident.getCommunity().success(function result(community) {

		if (!community) {
			return res.redirect('/community/new');
		}

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
	var resident = req.user;

	resident.getCommunity().success(function result(community) {
		return res.render('task/views/form', {
			title: res.__('New Task')
			, action: '/community/' + community.slug + '/task'
		});
	});
};

/** PrivateFunction: createTask
 * Creates a task
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
function createTask(req, res) {
	var resident = req.user
		, db = req.app.get('db')
		, Task = db.daoFactoryManager.getDAO('Task');
	resident.getCommunity()
		.success(function result(community) {
			if (!community) {
				return res.redirect('/community/new');
			}

			var taskData = {
				name: req.param('txtTask')
				, description: req.param('txtDescription')
				, reward: req.param('txtReward')
				, dueDate: moment(req.param('txtDueDate')).toDate()
			};

			Task.create(taskData)
				.success(function createResult(task) {

					task.setCommunity(community)
						.success(function setCommunityResult() {

							task.setCreator(resident)
								.success(function setCreatorResult() {
									req.flash('success',
										res.__('Task successfully added.'));
									return res.redirect('.');
								})
								.error(function setCreatorError(){
									res.send(500);
								});
						})
						.error(function setCommunityError() {
							res.send(500);
						});
				})
				.error(function createError() {
					res.send(500);
				});
		})
		.error(function getCommunityError() {
			return res.send(500);
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
		, Task = db.daoFactoryManager.getDAO('Task')
		, Community = db.daoFactoryManager.getDAO('Community');

	Task.find(taskId)
		.success(function findResult(task) {
			if (!task) {
				return res.send(404);
			}

			Community.find({ where: {slug: slug}})
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
			task.name = req.param('txtTask');
			task.reward = req.param('txtReward');
			task.description = req.param('txtDescription');
			task.dueDate = moment(req.param('txtDueDate')).toDate();
			task.save()
				.success(function taskSaved() {
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
				req.flash('error',
					res.__('Only not fulfilled tasks can be edited.'));
				return res;
			}

			task.destroy()
				.success(function deletedTask() {
					req.flash('success', res.__('Task deleted successfully'));
					return res.redirect('/community/' +
						community.slug + '/task');
				})
				.error(function errorDeletingTask() {
					return res.send(500);
				});
	});
};