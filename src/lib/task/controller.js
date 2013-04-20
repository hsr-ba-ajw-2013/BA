/** Controller: Task.Controller
 * Task Controller
 */

var path = require('path')
	, validatorsPath = path.join('..', '..', 'shared', 'validators')
	, createTaskValidator = require(
		path.join(validatorsPath, 'create-task'))
	, moment = require('moment');

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

		community.getTasks({order: 'id DESC'}).success(function result(tasks) {
			res.render('task/views/index', {
				title: res.__('Tasks')
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
	res.render('task/views/fresh', {
				title: res.__('New Task')
			});
};

/** PrivateFunction: createTask
 * Creates a task
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
var createTask = function createTask(req, res) {
	var resident = req.user
		, db = req.app.get('db')
		, Task = db.daoFactoryManager.getDAO('Task');

	resident.getCommunity().success(function result(community) {

		if (!community) {
			return res.redirect('/');
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
			.error(function createError(error) {
				console.log(error);
				res.send(500);
			});
	});
};

/** Function: create
 * POST-target for <fresh> which will validate the form using
 * <CreateTaskValidator> and if successful, call <createTask>.
 */
exports.create = [createTaskValidator, createTask];

/** Function: check
 * Marks a task as done.
 *
 * Parameters:
 *   (Request) req - Request
 *   (Response) res - Response
 */
exports.check = function check(req, res) {
	var resident = req.user
		, db = req.app.get('db')
		, Task = db.daoFactoryManager.getDAO('Task')
		, Community = db.daoFactoryManager.getDAO('Community')
		, taskId = req.params.id
		, slug = req.params.slug;

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

					task.fulfilledAt = new Date();
					task.save().success(function taskSaveSuccess() {
						task.setFulfillor(resident)
							.success(function setFulfillorResult() {
								return res.redirect('../../');
							})
							.error(function setFulfillorError(error) {
								console.log(error);
								return res.send(500);
							});
					})
					.error(function taskSaveError(error) {
						console.log(error);
						return res.send(500);
					});

				})
				.error(function findCommunityError(error) {
					console.log(error);
					return res.send(500);
				});
		});

};

exports.get = exports.update =
	exports.del = function(req, res) {
		req = req;//FIXME REMOVE !! JSHINT IN YA FACE.
		res.send(404);
};