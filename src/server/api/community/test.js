/* global config, describe, it, before, beforeEach, expect, should */
var join = require('path').join
	, srcPath = join(process.cwd(),
		(process.env.COVERAGE ? 'src-cov' : 'src'))
	, controller = require(join(srcPath, 'server', 'api', 'community',
		'controller'))
	, utils = require(join(srcPath, 'server', 'api', 'utils'))
	, errors = require(join(srcPath, 'server', 'api', 'community', 'errors'))
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

describe('Community', function() {

	describe('Create', function() {

		describe('authorized', function() {
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

			describe('without community for the user', function() {
				it('should create the community and assign the resident'
					, function(done) {
						var success = function success() {
								should.exist(resident.CommunityId);
								resident.isAdmin.should.equal(true);
								done();
							}
							, error = function error(err) {
								done(err);
							}
							, data = {
								name: utils.randomString(12)
							}
							, functionScope = {
								req: req
								, app: app
							}
							, scopedCreateCommunity =
								controller.createCommunity.bind(functionScope
									, success, error, data);
						scopedCreateCommunity();
				});
			});

			describe('with community for the user', function() {
				it('should throw a ResidentAlreadyInCommunityError'
					, function(done) {
						var success = function success() {
							done('Should throw a ' +
								'ResidentAlreadyInCommunityError');
						}
						, error = function error(err) {
							err.name.should.equal(
								'ResidentAlreadyInCommunityError');
							err.httpStatusCode.should.equal(409);
							done();
						}
						, data = {
							name: utils.randomString(12)
						}
						, functionScope = {
							req: req
							, app: app
						}
						, scopedCreateCommunity =
							controller.createCommunity.bind(functionScope
								, success, error, data);
						resident.CommunityId = 1;
						resident.save().success(function saved() {
							scopedCreateCommunity();
						});
				});
			});

			describe('with an existing community with the same name'
				, function() {
					it('should throw a CommunityAlreadyExistsError'
						, function(done) {
							var name = utils.randomString(12)
								, success = function success() {
									done('Should throw a ' +
										'CommunityAlreadyExistsError');
								}
								, error = function error(err) {
									err.name.should.equal(
										'CommunityAlreadyExistsError');
									err.httpStatusCode.should.equal(409);
									done();
								}
								, data = {
									name: name
								}
								, functionScope = {
									req: req
									, app: app
								}
								, scopedCreateCommunity =
									controller.createCommunity.bind(
										functionScope , success, error, data);
							communityDao.create({
								name: name
								, slug: name
								, shareLink: name
							}).success(function() {
								scopedCreateCommunity();
							}).error(function(err) {
								done(err);
							});
					});
			});

			describe('with an existing community with the same slug'
				, function() {
					it('should append the community id to the slug'
						, function(done) {
							var name1 = 'test-1'
								, name2 = 'test 1'
								, success = function success() {
									communityDao.find({where: {name: name2}})
										.success(function found(community) {
											var expectedSlug = name1 +
												'-' + community.id;
											community.name.should.equal(name2);
											community.slug.should.equal(
												expectedSlug);
											done();
										});
								}
								, error = function error(err) {
									done(err);
								}
								, data2 = {
									name: name2
								}
								, functionScope = {
									req: req
									, app: app
								}
								, scopedCreateCommunity =
									controller.createCommunity.bind(
										functionScope , success, error, data2);
							communityDao.create({
								name: name1
								, slug: name1
								, shareLink: name1
							}).success(function() {
								scopedCreateCommunity();
							}).error(function(err) {
								done(err);
							});
					});
			});
		});
	});

	describe('Look up community with slug', function() {

		describe('authorized', function() {
			var resident
				, community
				, req;

			beforeEach(function(done) {
				testUtils.createResident(residentDao
					, function(err, createdResident) {
					if(err) {
						return done(err);
					}
					resident = createdResident;
					req = testUtils.req({ user: resident });

					testUtils.createCommunity(communityDao
						, function(err, createdCommunity) {
						community = createdCommunity;
						done();
					});
				});
			});

			it('should find and return the community', function(done) {
				var success = function success() {
						done();
					}
					, error = function error(err) {
						throw new Error(err);
					}
					, functionScope = {
						req: req
						, app: app
					}
					, scopedGetCommunityWithSlug =
						controller.getCommunityWithSlug.bind(
							functionScope, success, error, community.slug);

				scopedGetCommunityWithSlug();
			});

			it('should return a NotFound Error if the community does not exist'
				, function(done) {
					var success = function success() {
						throw new Error('Should throw a NotFound Error');
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
					, scopedGetCommunityWithSlug =
						controller.getCommunityWithSlug.bind(
							functionScope, success, error, 'INVALID');

					scopedGetCommunityWithSlug();
			});
		});
	});

	describe('Get Tasks for Community', function() {

		describe('authorized', function() {
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
				testUtils.createAndAssignCommunity(communityDao, resident, 12345
					, function(err, createdCommunity) {
						if(err) {
							return done(err);
						}
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
								req: req
								, app: app
							}
							, scopedGetTasksForCommunity =
								controller.getTasksForCommunityWithSlug.bind(
									functionScope, success, error
									, createdCommunity.slug);

						scopedGetTasksForCommunity();
				});
			});

			it('should throw a not found exception if there aren\'t any tasks'
				, function(done) {
				testUtils.createAndAssignCommunity(communityDao, resident, null
					, function(err, createdCommunity) {
						if(err) {
							return done(err);
						}
						var success = function success() {
								throw new Error(
									'Should throw a forbidden (403) exception');
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
									functionScope, success, error
									, createdCommunity.slug);

						scopedGetTasksForCommunity();
				});
			});

			it('should return the tasks for the community', function(done) {
				testUtils.createAndAssignCommunity(communityDao, resident, null
					, function(err, createdCommunity) {
						if(err) {
							return done(err);
						}
						testUtils.createTask(taskDao, resident, createdCommunity
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
									, createdCommunity.slug);

							scopedGetTasksForCommunity();
						});
				});
			});
		});
	});

	describe.skip('Delete', function() {

		describe('authorized', function() {
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

			it('should throw an exception when the resident isnot an admin'
				, function() {
					var success = function success() {
							throw new Error(
								'Should throw a forbidden (403) exception');
						}
						, error = function error(err) {
							throw new Error(err);
						}
						, functionScope = {
							req: testUtils.req({
								params: {
									'community': 1
								}
							})
							, app: app
						}
						, scopedDeleteCommunity =
							controller.deleteCommunity.bind(
								functionScope, success, error);

				// Throw because throw is a reserved word.
				expect(scopedDeleteCommunity).to.Throw(
					errors.ForbiddenError);
			});

			it('should throw an exception when the resident is admin but' +
				' not for the chosen community', function(done) {
					testUtils.createAndAssignCommunity(communityDao, resident
						, 1024, function(err) {
						if(err) {
							return done(err);
						}
						var success = function success() {
								throw new Error(
									'Should throw a forbidden (403)' +
									' exception');
							}
							, error = function error(err) {
								throw new Error(err);
							}
							, functionScope = {
								req: testUtils.req({
									params: {
										'community': 1
									}
								})
								, app: app
							}
							, scopedDeleteCommunity =
								controller.deleteCommunity.bind(
									functionScope, success, error);

						// Throw because throw is a reserved word.
						expect(scopedDeleteCommunity).to.Throw(
							errors.ForbiddenError);
					});
			});

			it('should delete the community', function(done) {
				testUtils.createAndAssignCommunity(communityDao, resident, null
					, function(err, community) {
					if(err) {
						return done(err);
					}
					var success = function success() {
							community.enabled.should.equal(false);
							resident.isAdmin.should.equal(false);
							done();
						}
						, error = function error(err) {
							done(err);
						}
						, functionScope = {
							req: testUtils.req({
								params: {
									'community': community.slug
								}
							})
							, app: app
						}
						, scopedDeleteCommunity =
							controller.deleteCommunity.bind(
								functionScope, success, error);

					// Throw because throw is a reserved word.
					scopedDeleteCommunity();
				});
			});
		});
	});


	describe('Validator', function() {
		var validators = require(
			join(srcPath, 'server', 'api', 'community', 'validators'))
			, validationError = new errors.ValidationError();


		it('should throw a ValidationError when omiting a community name',
			function(done) {
				var success = function() { }
					, error = function(err) {
						if(err.name === validationError.name) {
							done();
						}
					}
					, testData = { };

				validators.createCommunity(success, error, testData);
			}
		);

		it('should throw a ValidationError when passing a name with more ' +
			'than 255 characters length', function(done) {
			var success = function() { }
				, error = function(err) {
					if(err.name === validationError.name) {
						done();
					}
				}
				, testData = {
					name: utils.randomString(300)
				};

			validators.createCommunity(success, error, testData);
		});

		it('should sanitize the name by preventing XSS', function(done) {
			var testData = { name: '<script>alert("XSS!");</script>' }
				, expectedData = {
					name: '[removed]alert&#40;"XSS!"&#41;;[removed]'
				}
				, success = function() {
					if(testData.name === expectedData.name) {
						done();
					}
				}
				, error = function() { };

			validators.createCommunity(success, error, testData);
		});
	});

});