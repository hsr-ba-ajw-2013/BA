var join = require('path').join
	, srcPath = join(process.cwd(), (process.env.COVERAGE ? 'src-cov' : 'src'))
	, mockFactory = require(join(srcPath, 'server', 'api', 'utils', 'test'))
	, errors = require(join(srcPath, 'server', 'api', 'errors'))
	, utils = require(join(srcPath, 'server', 'api', 'utils'))

describe('BasicAuthentication', function() {
	var basicAuthentication = require(join(
		srcPath, 'server', 'api', 'policy', 'basicAuthentication'));

	it('should call the error callback with a NotAuthorizedError ' +
		'when not authorized', function(done) {

		var expectedError = new errors.NotAuthorizedError()
			, mockScope = {
				req: mockFactory.req()
			}
			, success = function() { }
			, error = function(err) {
				if(err.name === expectedError.name) {
					done();
				}
			}

		basicAuthentication.call(mockScope, success, error);
	});

	it('should call the success callback when authorized', function(done) {
		var mockScope = {
				req: mockFactory.req({ user: {} })
			}
			, success = done;

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

	function createResident(done) {
		residentDao.create({
			name: utils.randomString(12)
			, facebookId: utils.randomInt()
		}).success(function success(createdResident) {
			done(null, createdResident);
		}).error(function error(err) {
			done(err);
		});
	}

	function createCommunity(done) {
		var name = utils.randomString(12);
		communityDao.create({
			name: name
			, slug: name
			, shareLink: name
		}).success(function success(createdCommunity) {
			done(null, createdCommunity);
		}).error(function error(err) {
			done(err);
		});
	}

	function createAndAssignCommunity(resident, done) {
		createCommunity(function(err, createdCommunity) {
			if(err) {
				return done(err);
			}
			resident.isAdmin = true;
			resident.setCommunity(createdCommunity);

			resident.save().success(function saved() {
				done(null, createdCommunity);
			}).error(function error(err) {
				done(err);
			});
		});
	}



	before(function setupDb(done) {
		require(join(srcPath, 'server', 'middleware', 'db'))(null, config,
			function(err, connectedDb) {
				if(err) {
					return done(err);
				}

				db = connectedDb;
				residentDao = db.daoFactoryManager.getDAO('Resident');
				communityDao = db.daoFactoryManager.getDAO('Community');
				app = mockFactory.app(db);
				done();
		});
	});

	describe('in not authorized context', function() {
		it('shoud call the error callback with a NotAuthorizedError when the ' +
			'user is not member of the given community', function(done) {
			var expectedError = new errors.NotAuthorizedError()
				, mockScope = {
					req: mockFactory.req({ app: app })
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
			, communitySlug;

		beforeEach(function(done) {
			createResident(function(err, createdResident) {
				if(err) {
					return done(err);
				}

				createAndAssignCommunity(createdResident
					, function(err, createdCommunity) {
						if(err) { 
							return done(err);
						}

						sessionResident = createdResident;
						communitySlug = createdCommunity.slug;
						req = mockFactory.req({
							app: app
							, user: sessionResident
						});

						done();
					});
			});
		});

		it('should call the success callback when the user is member of the ' +
			'community', function(done) {
			var mockScope = {
					req: req
				}
				, success = done
				, error = function() { };

			authorizedForCommunity.call(
				mockScope, success, error, communitySlug);
		});

	});
});
