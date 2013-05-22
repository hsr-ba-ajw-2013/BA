/* global config, describe, it, before, beforeEach */
var join = require('path').join
	, srcPath = join(process.cwd(),
		(process.env.COVERAGE ? 'src-cov' : 'src'))
	, controller = require(join(srcPath, 'server', 'api', 'task',
		'controller'))
	, testUtils = require(join(srcPath, 'server', 'api', 'utils', 'test'))
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
	});
});