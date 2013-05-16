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
	, Community
	, Resident
	, db;

before(function(done) {
	require(join(srcPath, 'server', 'middleware', 'db'))(null, config,
		function(err, connectedDb) {
			if(err) {
				return done(err);
			}
			// setup test-local variables as defined at the top of the file.
			// those are all dependant on a synced db.
			db = connectedDb;
			Resident = db.daoFactoryManager.getDAO('Resident');
			Community = db.daoFactoryManager.getDAO('Community');
			app = test.app(db);
			done();
	});
});

describe('Community', function() {
	describe('Create', function() {
		describe('unauthorized', function() {
			it('should throw a not authorized (401) exception', function() {
				var success = function success() {
						throw new Error(
							'Should throw a not authorized (401) exception');
					}
					, error = function error(err) {
						throw new Error(err);
					}
					, data = {
						name: 'Test'
					}
					, functionScope = {
						req: test.req()
						, app: app
					}
					, scopedCreateCommunity = controller.createCommunity.bind(
						functionScope, success, error, data);

				// Throw because throw is a reserved word.
				expect(scopedCreateCommunity).to.Throw(
					errors.NotAuthorizedError);
			});
		});
		describe('authorized', function() {
			var resident
				, req;

			beforeEach(function(done) {
				Resident.create({
					name: utils.randomString(12)
					, facebookId: utils.randomInt()
				}).success(function success(createdResident) {
					resident = createdResident;
					req = test.req(resident);
					done();
				}).error(function error(err) {
					done(err);
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
							done(new Error('XSS in Name should not be allowed'));
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
							Community.create({
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
									Community.find({where: {name: name2}})
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
							Community.create({
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

	describe('Delete', function() {

	});
});