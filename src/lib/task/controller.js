/** Controller: Task.Controller
 * Task Controller
 */

var path = require('path')
	, validatorsPath = path.join('..', '..', 'shared', 'validators')
	, createTaskValidator = require(
		path.join(validatorsPath, 'create-task'));

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
	var resident = req.user;

	resident.getCommunity().success(function result(community) {

		if (!community) {
			return res.redirect('/');
		}

		res.flash('success', 'Task successfully added.');
		res.redirect('..');
	});
};

exports.create = [createTaskValidator, createTask];

exports.create  = exports.get = exports.update =
	exports.del = function(req, res) {
		req = req;//FIXME REMOVE !! JSHINT IN YA FACE.
		res.send(404);
};