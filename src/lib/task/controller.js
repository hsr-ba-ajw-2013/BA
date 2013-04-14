/** Controller: Task.Controller
 * Task Controller
 */

var path = require('path')
	, validatorsPath = path.join('..', '..', 'shared', 'validators')
	, createTaskValidator = require(
		path.join(validatorsPath, 'create-task'))
	, moment = require('moment');

exports.index = function index(req, res) {
	var resident = req.user;

	resident.getCommunity().success(function result(community) {

		if (!community) {
			return res.redirect('/');
		}

		community.getTasks().success(function result(tasks) {
			res.render('task/views/index', {
				title: res.__('Tasks')
				, tasks: tasks
			});
		});
	});
};

exports.fresh = function fresh(req, res) {
	res.render('task/views/fresh', {
				title: res.__('New Task')
			});
};

var createTask = function createCommunity(req, res) {
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

exports.create = [createTaskValidator, createTask];

exports.get = exports.update =
	exports.del = function(req, res) {
		req = req;//FIXME REMOVE !! JSHINT IN YA FACE.
		res.send(404);
};