/* global config, describe, it, before, beforeEach, expect */
var join = require('path').join
	, srcPath = join(process.cwd(),
		(process.env.COVERAGE ? 'src-cov' : 'src'))
	, controller = require(join(srcPath, 'server', 'api', 'community',
		'controller'))
	, utils = require(join(srcPath, 'server', 'api', 'utils'))
	, errors = require(join(srcPath, 'server', 'api', 'errors'))
	, test = require(join(srcPath, 'server', 'api', 'utils', 'test'))
	, should = require('chai').should()
	, app
	, CommunityDao
	, ResidentDao
	, db;


function createResident(done) {
	ResidentDao.create({
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
	CommunityDao.create({
		name: name
		, slug: name
		, shareLink: name
	}).success(function success(createdCommunity) {
		done(null, createdCommunity);
	}).error(function error(err) {
		done(err);
	});
}

function testNotAuthorizedException(additionalParams, additionalBinding
	, functionToCall) {
	//additionalParams = additionalParams || {};
	var success = function success() {
		console.log('fooobar');
			throw new Error(
				'Should throw a not authorized (401) exception');
		}
		, error = function error(err) {
			console.log(err);
			throw new Error(err);
		}
		, functionScope = {
			req: test.req({
				params: additionalParams
			})
			, app: app
		}
		, scopedFunctionToCall = functionToCall.bind(
			functionScope, success, error, additionalBinding);
	// Throw because 'throw' is a reserved word.
	expect(scopedFunctionToCall).to.Throw(
		errors.NotAuthorizedError);
}


before(function(done) {
	require(join(srcPath, 'server', 'middleware', 'db'))(null, config,
		function(err, connectedDb) {
			if(err) {
				return done(err);
			}
			// setup test-local variables as defined at the top of the file.
			// those are all dependant on a synced db.
			db = connectedDb;
			ResidentDao = db.daoFactoryManager.getDAO('Resident');
			CommunityDao = db.daoFactoryManager.getDAO('Community');
			app = test.app(db);
			done();
	});
});

describe('Community', function() {
	describe('Create', function() {
		describe('unauthorized', function() {
			it('should throw a not authorized (401) exception', function() {
				testNotAuthorizedException(null, {name: 'Test'}
					, controller.createCommunity);
			});
		});
		describe('authorized', function() {
			var resident
				, req;

			beforeEach(function(done) {
				createResident(function(err, createdResident) {
					if(err) {
						return done(err);
					}
					resident = createdResident;
					req = test.req({ user: resident });
					done();
				});
			});

			it.skip('should generate error when trying to pass a name longer' +
				' than 255 chars', function(done) {
					var success = function success() {
							done(new Error('Name max. length should' +
								' be 255 chars.'));
						}
						, error = function error() {
							done();
						}
						, data = {
							name: utils.randomString(300)
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

			it.skip('should prevent XSS injection for the name'
				, function(done) {
					var success = function success() {
							done(new Error('XSS in Name should not ' +
								'be allowed'));
						}
						, error = function error() {
							done();
						}
						, data = {
							name: '<script>alert("XSS!");</script>'
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
							CommunityDao.create({
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
									CommunityDao.find({where: {name: name2}})
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
							CommunityDao.create({
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
		describe('unauthorized', function() {
			it('should throw a not authorized (401) exception', function() {
				testNotAuthorizedException(null, 'testslug'
					, controller.getCommunityWithSlug);
			});
		});

		describe('authorized', function() {
			var resident
				, community
				, req;

			beforeEach(function(done) {
				createResident(function(err, createdResident) {
					if(err) {
						return done(err);
					}
					resident = createdResident;
					req = test.req({ user: resident });

					createCommunity(function(err, createdCommunity) {
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

	describe.skip('Delete', function() {
		describe('unauthorized', function() {
			it('should throw a not authorized (401) exception', function() {
				testNotAuthorizedException({community: 1}, null
					, controller.deleteCommunity);
			});
		});

		describe('authorized', function() {
			var resident
				, req;

			beforeEach(function(done) {
				createResident(function(err, createdResident) {
					if(err) {
						return done(err);
					}
					resident = createdResident;
					req = test.req({ user: resident });
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
						req: test.req({
							params: {
								'community': 1
							}
						})
						, app: app
					}
					, scopedDeleteCommunity = controller.deleteCommunity.bind(
						functionScope, success, error);

				// Throw because throw is a reserved word.
				expect(scopedDeleteCommunity).to.Throw(
					errors.ForbiddenError);
			});

			/** PrivateFunction: createAndAssignCommunity
			 * Creates a community and assigns the resident to it.
			 *
			 * Parameters:
			 *   (Integer) wrongCommunityId - if specified, will assign a wrong
			 *                                community id to the resident
			 *   (Function) done - Callback after creating
			 */
			function createAndAssignCommunity(wrongCommunityId, done) {
				createCommunity(function(err, createdCommunity) {
					if(err) {
						return done(err);
					}
					resident.isAdmin = true;
					resident.CommunityId = wrongCommunityId ||
												createdCommunity.id;
					resident.save().success(function saved() {
						done(null, createdCommunity);
					}).error(function error(err) {
						done(err);
					});
				});
			}

			it('should throw an exception when the resident is admin but' +
				' not for the chosen community', function(done) {
					createAndAssignCommunity(1024, function(err) {
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
								req: test.req({
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
				createAndAssignCommunity(null, function(err, community) {
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
							req: test.req({
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
});