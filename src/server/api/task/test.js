/* global config, describe, it, before, beforeEach */
var join = require('path').join
	, srcPath = join(process.cwd(),
		(process.env.COVERAGE ? 'src-cov' : 'src'))
	, controller = require(join(srcPath, 'server', 'api', 'task',
		'controller'))
	, validators = require(join(srcPath, 'server', 'api', 'task',
		'validators'))
	, errors = require(join(srcPath, 'server', 'api', 'errors'))
	, validationError = new errors.ValidationError()
	, testUtils = require(join(srcPath, 'server', 'api', 'utils', 'test'))
	, utils = require(join(srcPath, 'server', 'api', 'utils'))
	, app
	, communityDao
	, residentDao
	, taskDao
	, db;

testUtils.initDb(config, before, function(initializedDb) {
	// setup test-local variables as defined at the top of the file.
	// those are all dependant on a synced db.
	db = initializedDb;
	residentDao = db.daoFactoryManager.getDAO('Resident');
	communityDao = db.daoFactoryManager.getDAO('Community');
	taskDao = db.daoFactoryManager.getDAO('Task');
	app = testUtils.app(db);
});

describe('Task', function() {
	var RESIDENTS = 2
		, residents = []
		, community
		, req;

	beforeEach(function(done) {
		testUtils.createAmountOfResidents(0, RESIDENTS, residentDao
			, function ok(err, createdResidents) {
			if(err) {
				return done(err);
			}
			residents = createdResidents;
			req = testUtils.req({ user: createdResidents[0] });
			testUtils.createCommunity(communityDao
				, function(err, createdCommunity) {
				if(err) {
					return done(err);
				}
				community = createdCommunity;
				createdResidents[0].setCommunity(community).complete(done);
			});
		});
	});

	describe('get task with id', function() {
		it('should return a 404 when the task is not found', function(done) {
			var success = function success() {
					done(new Error('Should throw a 404 not found error'));
				}
				, error = function error(err) {
					err.name.should.equal('Not Found');
					err.httpStatusCode.should.equal(404);
					done();
				}
				, taskId = 1337
				, functionScope = {
					req: req
					, app: app
				}
				, scopedGetTaskWithId =
					controller.getTaskWithId.bind(functionScope
						, success, error, taskId);
			scopedGetTaskWithId();
		});

		it('should return a 403 forbidden error when the logged-in user is' +
			' not in the same community as the task', function(done) {
			testUtils.createTask(taskDao, residents[0], community
				, function(err, createdTask) {
				if(err) {
					return done(err);
				}
				var success = function success() {
						done(new Error('Should throw a 403 forbidden error'));
					}
					, error = function error(err) {
						err.name.should.equal('Forbidden');
						err.httpStatusCode.should.equal(403);
						done();
					}
					, taskId = createdTask.id
					, functionScope = {
						req: testUtils.req({ user: residents[1] })
						, app: app
					}
					, scopedGetTaskWithId =
						controller.getTaskWithId.bind(functionScope
							, success, error, taskId);
				scopedGetTaskWithId();
			});
		});

		it('should return the task when the task is found & the resident is' +
			' in the same community', function(done) {
			testUtils.createTask(taskDao, residents[0], community
				, function(err, createdTask) {
				if(err) {
					return done(err);
				}
				var success = function success() {
						done();
					}
					, error = function error(err) {
						done(err);
					}
					, taskId = createdTask.id
					, functionScope = {
						req: req
						, app: app
					}
					, scopedGetTaskWithId =
						controller.getTaskWithId.bind(functionScope
							, success, error, taskId);
				scopedGetTaskWithId();
			});
		});
	});

	describe('Get Tasks for Community', function() {

		it('should throw an exception if the community does not exist'
			, function(done) {
			var success = function success() {
					throw new Error(
						'Should throw a not found (404) exception');
				}
				, error = function error(err) {
					err.name.should.equal(
						'Not Found');
					err.httpStatusCode.should.equal(404);
					done();
				}
				, functionScope = {
					req: req
					, app: app
				}
				, scopedGetTasksForCommunity =
					controller.getTasksForCommunityWithSlug.bind(
						functionScope, success, error, 'INVALIDSLUG');

			scopedGetTasksForCommunity();
		});

		it('should throw an exception if the resident is not' +
			' within the requested community', function(done) {
				var success = function success() {
						throw new Error(
							'Should throw a forbidden (403) exception');
					}
					, error = function error(err) {
						err.name.should.equal(
							'Forbidden');
						err.httpStatusCode.should.equal(403);
						done();
					}
					, functionScope = {
						req: testUtils.req({ user: residents[1] })
						, app: app
					}
					, scopedGetTasksForCommunity =
						controller.getTasksForCommunityWithSlug.bind(
							functionScope, success, error
							, community.slug);

				scopedGetTasksForCommunity();
		});

		it('should throw a not found exception if there aren\'t any tasks'
			, function(done) {
				var success = function success() {
						throw new Error(
							'Should throw a forbidden (403) exception');
					}
					, error = function error(err) {
						err.name.should.equal(
							'NoTasksFoundError');
						err.httpStatusCode.should.equal(404);
						done();
					}
					, functionScope = {
						req: req
						, app: app
					}
					, scopedGetTasksForCommunity =
						controller.getTasksForCommunityWithSlug.bind(
							functionScope, success, error
							, community.slug);

				scopedGetTasksForCommunity();
		});

		it('should return the tasks for the community', function(done) {
			testUtils.createTask(taskDao, residents[0], community
				, function(err) {
				if(err) {
					return done(err);
				}
				var success = function success() {
					done();
				}
				, error = function error(err) {
					done(err);
				}
				, functionScope = {
					req: req
					, app: app
				}
				, scopedGetTasksForCommunity =
					controller.getTasksForCommunityWithSlug.bind(
						functionScope, success, error
						, community.slug);

				scopedGetTasksForCommunity();
			});
		});
	});

	describe('Validator', function() {
		describe('Constraints', function() {
			it('should throw a ValidationError for each omitted required field'
				, function(done) {
				var success = function() {
						done(new Error('Should throw a ValidationError'));
					}
					, error = function(err) {
						err.name.should.equal(validationError.name);
						err.httpStatusCode.should.equal(
							validationError.httpStatusCode);
						err.message.should.have.length(3);
						done();
					}
					, testData = {};

				validators.createTask(success, error, null, testData);
			});

			it('should throw a ValidationError with a name > 255 chars'
				, function(done) {
				var success = function() {
						done(new Error('Should throw a ValidationError'));
					}
					, error = function(err) {
						err.name.should.equal(validationError.name);
						err.httpStatusCode.should.equal(
							validationError.httpStatusCode);
						err.message.should.have.length(1);
						done();
					}
					, testData = {
						name: utils.randomString(256)
						, reward: 3
						, dueDate: new Date(new Date().getTime() +
									(24 * 3600 * 1000))
					};

				validators.createTask(success, error, null, testData);
			});

			it('should throw a ValidationError with a reward < 1'
				, function(done) {
				var success = function() {
						done(new Error('Should throw a ValidationError'));
					}
					, error = function(err) {
						err.name.should.equal(validationError.name);
						err.httpStatusCode.should.equal(
							validationError.httpStatusCode);
						err.message.should.have.length(1);
						done();
					}
					, testData = {
						name: utils.randomString(12)
						, reward: 0
						, dueDate: new Date(new Date().getTime() +
									(24 * 3600 * 1000))
					};

				validators.createTask(success, error, null, testData);
			});

			it('should throw a ValidationError with a reward > 5'
				, function(done) {
				var success = function() {
						done(new Error('Should throw a ValidationError'));
					}
					, error = function(err) {
						err.name.should.equal(validationError.name);
						err.httpStatusCode.should.equal(
							validationError.httpStatusCode);
						err.message.should.have.length(1);
						done();
					}
					, testData = {
						name: utils.randomString(12)
						, reward: 6
						, dueDate: new Date(new Date().getTime() +
									(24 * 3600 * 1000))
					};

				validators.createTask(success, error, null, testData);
			});

			it('should throw a ValidationError with a reward which is not an' +
				' integer', function(done) {
				var success = function() {
						done(new Error('Should throw a ValidationError'));
					}
					, error = function(err) {
						err.name.should.equal(validationError.name);
						err.httpStatusCode.should.equal(
							validationError.httpStatusCode);
						err.message.should.have.length(1);
						done();
					}
					, testData = {
						name: utils.randomString(12)
						, reward: 'asdf'
						, dueDate: new Date(new Date().getTime() +
									(24 * 3600 * 1000))
					};

				validators.createTask(success, error, null, testData);
			});

			it('should throw a ValidationError with a dueDate not in the' +
				' future', function(done) {
				var success = function() {
						done(new Error('Should throw a ValidationError'));
					}
					, error = function(err) {
						err.name.should.equal(validationError.name);
						err.httpStatusCode.should.equal(
							validationError.httpStatusCode);
						err.message.should.have.length(1);
						done();
					}
					, testData = {
						name: utils.randomString(12)
						, reward: 3
						, dueDate: new Date(new Date().getTime() -
									(24 * 3600 * 1000))
					};

				validators.createTask(success, error, null, testData);
			});

			it('should throw a ValidationError with a dueDate not being' +
				' a parsable date', function(done) {
				var success = function() {
						done(new Error('Should throw a ValidationError'));
					}
					, error = function(err) {
						err.name.should.equal(validationError.name);
						err.httpStatusCode.should.equal(
							validationError.httpStatusCode);
						err.message.should.have.length(1);
						done();
					}
					, testData = {
						name: utils.randomString(12)
						, reward: 3
						, dueDate: 'asdf'
					};

				validators.createTask(success, error, null, testData);
			});

			it('should throw a ValidationError with a description longer' +
				' than 255 chars', function(done) {
				var success = function() {
						done(new Error('Should throw a ValidationError'));
					}
					, error = function(err) {
						err.name.should.equal(validationError.name);
						err.httpStatusCode.should.equal(
							validationError.httpStatusCode);
						err.message.should.have.length(1);
						done();
					}
					, testData = {
						name: utils.randomString(12)
						, reward: 3
						, dueDate: new Date(new Date().getTime() +
											(24 * 3600 * 1000))
						, description: utils.randomString(256)
					};

				validators.createTask(success, error, null, testData);
			});
		});

		describe('Sanitize', function() {
			it('should sanitize the name & description by preventing XSS'
				, function(done) {
				var testData = {
						name: '<script>alert("XSS!");</script>'
						, reward: '3'
						, dueDate: new Date(new Date().getTime() +
										(24 * 3600 * 1000))
						, description: '<script>alert("XSS!");</script>'
					}
					, expectedData = {
						name: '[removed]alert&#40;"XSS!"&#41;;[removed]'
						, reward: 3
						, description: '[removed]alert&#40;"XSS!"&#41' +
							';;[removed]'
					}
					, success = function() {
						for(var key in expectedData) {
							testData[key].should.equal(expectedData[key]);
						}
						done();
					}
					, error = function(err) {
						done(err);
					};

				validators.createTask(success, error, null, testData);
			});
		});
	});

	describe('create task', function() {

		it('should create the task if the resident is in a community and ' +
			'the data is correct', function(done) {
			var success = function success() {
					done();
				}
				, error = function error(err) {
					done(err);
				}
				, data = {
					name: utils.randomString(12)
					, description: utils.randomString(100)
					, reward: 5
					, dueDate: new Date(new Date().getTime() +
										(24 * 3600 * 1000))
				}
				, functionScope = {
					req: req = testUtils.req({
						user: residents[0]
						, community: community
					})
					, app: app
				}
				, scopedCreateTask =
					controller.createTask.bind(functionScope
						, success, error, community.slug, data);
			scopedCreateTask();
		});
	});

	describe('update task', function() {
		var existingTask;

		before(function(done) {
			var success = function success(task) {
					existingTask = task;
					done();
				}
				, error = function error(err) {
					done(err);
				}
				, data = {
					name: utils.randomString(12)
					, description: utils.randomString(100)
					, reward: 5
					, dueDate: new Date(new Date().getTime()+(24 * 3600 * 1000))
				}
				, functionScope = {
					req: req = testUtils.req({
						user: residents[0]
						, community: community
					})
					, app: app
				};

				controller.createTask.call(
					functionScope
					, success
					, error
					, community.slug
					, data);
		});

		it('should update an existing task', function(done) {
			var updateData = {
					name: utils.randomString(12)
					, description: utils.randomString(200)
					, reward: 1
				}
				, success = function success(task) {
					if(task.name === updateData.name &&
						task.description === updateData.description &&
						task.reward === updateData.reward) {
						done();
					}
				}
				, error = function error(err) {
					done(err);
				}
				, functionScope = {
					req: req = testUtils.req({
						user: residents[0]
						, community: community
					})
					, app: app
				};

				controller.updateTask.call(
					functionScope
					, success
					, error
					, community.slug
					, existingTask.id
					, updateData);
		});
	});
});