/* global describe, it, beforeEach, expect, should */
var join = require('path').join
	, srcPath = join(process.cwd(),
		(process.env.COVERAGE ? 'src-cov' : 'src'))
	, controller = require(join(srcPath, 'server', 'api', 'resident',
		'controller'))
	, utils = require(join(srcPath, 'server', 'api', 'utils'))
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

describe('Resident', function() {

	var resident
		, req;

	beforeEach(function(done) {
		testUtils.createResident(residentDao
			, function(err, createdResident) {
			if(err) {
				return done(err);
			}
			resident = createdResident;
			req = testUtils.req({ user: resident });
			done();
		});
	});

	describe('get resident with facebook id', function() {
		it('should throw a 404 error when facebook id hasn\'t been found'
			, function(done) {
			var success = function success() {
					done(new Error('Should throw a 404 error'));
				}
				, error = function error(err) {
					err.name.should.equal(
						'Not Found');
					err.httpStatusCode.should.equal(404);
					done();
				}
				, facebookId = 1337
				, functionScope = {
					req: req
					, app: app
				}
				, scopedGetResidentWithFacebookId =
					controller.getResidentWithFacebookId.bind(functionScope
						, success, error, facebookId);
			scopedGetResidentWithFacebookId();
		});

		it('should return the resident when a correct facebook id' +
			' has been submitted', function(done) {
			var success = function success(foundResident) {
					resident.name.should.equal(foundResident.name);
					resident.id.should.equal(foundResident.id);
					resident.facebookId.should.equal(foundResident.facebookId);
					done();
				}
				, error = function error(err) {
					done(err);
				}
				, facebookId = resident.facebookId
				, functionScope = {
					req: req
					, app: app
				}
				, scopedGetResidentWithFacebookId =
					controller.getResidentWithFacebookId.bind(functionScope
						, success, error, facebookId);
			scopedGetResidentWithFacebookId();
		})
	});
});