/* global config, describe, it, before, beforeEach */
var join = require('path').join
	, srcPath = join(process.cwd(), (process.env.COVERAGE ? 'src-cov' : 'src'))
	, testUtils = require(join(srcPath, 'server', 'api', 'utils', 'test'))
	, errors = require(join(srcPath, 'server', 'api', 'errors'));

describe('BasicAuthentication', function() {
	var basicAuthentication = require(join(
		srcPath, 'server', 'api', 'policy', 'basicAuthentication'));

	it('should call the error callback with a NotAuthorizedError ' +
		'when not authorized', function(done) {

		var expectedError = new errors.NotAuthorizedError()
			, mockScope = {
				req: testUtils.req()
			}
			, success = function() { }
			, error = function(err) {
				if(err.name === expectedError.name) {
					done();
				}
			};

		basicAuthentication.call(mockScope, success, error);
	});

	it('should call the success callback when authorized', function(done) {
		var mockScope = {
				req: testUtils.req({ user: {} })
			}
			, success = done;

		basicAuthentication.call(mockScope, success);
	});

	it('should add the user to the request', function(done) {
		var username = 'Tester'
			, mockScope = {
				req: testUtils.req({ user: { name: username } })
			}
			, success = function() {
				if(mockScope.req.user.name === username) {
					done();
				}
			};

		basicAuthentication.call(mockScope, success);
	});

});


describe('AuthorizedForCommunity', function() {
	var authorizedForCommunity = require(join(
			srcPath, 'server', 'api', 'policy', 'authorizedForCommunity'))
		, app
		, db
		, residentDao
		, communityDao
		, sessionResident;

	testUtils.initDb(config, before, function(initializedDb) {
		// setup test-local variables as defined at the top of the file.
		// those are all dependant on a synced db.
		db = initializedDb;
		residentDao = db.daoFactoryManager.getDAO('Resident');
		communityDao = db.daoFactoryManager.getDAO('Community');
		app = testUtils.app(db);
	});


	describe('in not authorized context', function() {
		it('shoud call the error callback with a NotAuthorizedError when the ' +
			'user is not member of the given community', function(done) {
			var expectedError = new errors.NotAuthorizedError()
				, mockScope = {
					req: testUtils.req({ app: app })
				}
				, success = function() { }
				, error = function(err) {
					if(err.name === expectedError.name) {
						done();
					}
				};
			authorizedForCommunity.call(mockScope, success, error);
		});
	});



	describe('in authorized context', function() {
		var req
			, community;

		beforeEach(function(done) {
			testUtils.createResident(residentDao
				, function(err, createdResident) {
				if(err) {
					return done(err);
				}

				testUtils.createAndAssignCommunity(communityDao, createdResident
					, null, function(err, createdCommunity) {
						if(err) {
							return done(err);
						}

						sessionResident = createdResident;
						community = createdCommunity;
						req = testUtils.req({
							app: app
							, user: sessionResident
						});

						done();
					});
			});
		});

		it('should give positive result when user is member of the ' +
			'community identified by an ID', function(done) {
			var mockScope = {
					req: req
				}
				, success = done
				, error = function(err) {
					done(err);
				};

			authorizedForCommunity.call(
				mockScope, success, error, community.id);
		});

		it('should give positive result when user is member of the ' +
			'community identified by a slug', function(done) {
			var mockScope = {
					req: req
				}
				, success = done
				, error = function(err) {
					done(err);
				};

			authorizedForCommunity.call(
				mockScope, success, error, community.slug);
		});

		it('should add the users community to the request', function(done) {
			var mockScope = {
				req: req
			}
			, success = function() {
				mockScope.req.community.id.should.equal(community.id);
				done();
			}
			, error = function(err) {
				done(err);
			};

			authorizedForCommunity.call(
				mockScope, success, error, community.slug);
		});

	});
});
