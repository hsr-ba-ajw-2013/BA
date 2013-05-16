/* global config, describe, it, before, beforeEach, expect */
var join = require('path').join
	, srcPath = join(process.cwd(),
		(process.env.COVERAGE ? 'src-cov' : 'src'))
	, controller = require(join(srcPath, 'server', 'api', 'community',
		'controller'))
	, utils = require(join(srcPath, 'server', 'api', 'utils'))
	, errors = require(join(srcPath, 'server', 'api', 'errors'))
	, test = require(join(srcPath, 'server', 'api', 'utils', 'test'))
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

			describe('without community for the user', function() {
				it('should create the community and assign the resident'
					, function(done) {
						var success = function success() {
								resident.CommunityId.should.be.not.undefined;
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
	/*

	describe('GET /community', function(){
		describe('unauthorized', function() {
			it('should redirect to /login', function(done){
				request(app)
					.get('/community')
					.followRedirect(false)
					.expect(302)
					.expect('Location', '/login', done);
			});
		});

		describe('authorized', function() {

			describe('without community for the user', function() {
				var req = request(app);

				beforeEach(function before(done) {
					req = doLogin(app, req);
					done();
				});

				it('should redirect to /community/./new with 302',
					function(done) {
						req.get('/community')
							.followRedirect(false)
							.expect(302)
							.expect('Location', '/community/./new', done);
				});
			});

			describe('with community for the user', function() {
				var req = request(app);

				beforeEach(function before(done) {
					req = doLogin(app, req);
					var communityName = utils.randomString(6);

					req.post('/community')
						.form({name: communityName})
						.end(function(err) {
							if (err) {
								return done(err);
							}
							return done();
						});
				});

				it('should show /community with 200', function(done) {

					req.get('/community')
						.expect(200, done);
				});
			});
		});
	});

	describe('POST /community', function() {
		describe('unauthorized', function() {
			it('should not create a community and return 302', function(done) {

				var req = request(app)
							.post('/community')
					, communityName =
						utils.randomString(12);

				req
					.followRedirect(true)
					.form({name: communityName})
					.expect(302, done);
			});
		});

		describe('authorized', function() {
			describe('without community for the user', function() {
				var req = request(app);

				beforeEach(function(done) {
					req = doLogin(app, req);
					done();
				});

				it('should redirect to /community/:slug/invite ' +
					'with 302 after creating a community'
					, function(done) {
					var communityName =
							utils.randomString(6);

					req.post('/community')
						.form({name: communityName})
						.expect(302)
						.expect('Location', '/community/' +
							uslug(communityName) + '/invite', done);
				});

				it('should not create a community with an empty name string'
					, function(done) {

					req.post('/community')
						.form({name: ''})
						.expect(302)
						.expect('Location', '/community/./new', done);

				});

				it('should not create a community with more than 255 chars'
					, function(done) {
					var communityName =
							utils.randomString(256);

					req.post('/community')
						.form({name: communityName})
						.expect(302)
						.expect('Location', '/community/./new', done);
				});

				it('should redirect to /community/./new with 302 ' +
					'if the community name already exists',
					function(done) {
						var communityName =
								utils.randomString(6)
							, Community = app.get('db')
											.daoFactoryManager
											.getDAO('Community');


						Community.create({name: communityName})
							.success(function createResult() {
								req.post('/community')
									.form({name: communityName})
									.expect(302)
									.expect('Location', '/community/./new'
										, done);
							})
							.error(function createError(errors) {
								done(errors);
							});
				});
			});

			describe('with community for the user', function() {

				var req = request(app);

				beforeEach(function before(done) {
					req = doLogin(app, req);
					var communityName = utils.randomString(6);

					req.post('/community')
						.form({name: communityName})
						.end(function(err) {
							if (err) {
								return done(err);
							}
							return done();
						});
				});

				it('should redirect to /community with 302',function(done) {
					var communityName =
							utils.randomString(6);

						req.post('/community')
							.form({name: communityName})
							.expect(302)
							.expect('Location', '/community', done);
				});
			});
		});
	});*/
});