/* global describe, it, beforeEach, db, expect */
var controller = require('./controller')
	, utils = require('../utils')
	, errors = require('../errors')
	, test = require('../utils/test')
	, app = test.app(db);

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
				var Resident = db.daoFactoryManager.getDAO('Resident');
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

			describe('without community for the user', function() {
				it('should create the community', function(done) {
					var success = function success() {
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
				it('should throw a ResidentAlreadyInCommunityError',
					function(done) {
						var success = function success() {
							done('Should throw a ' +
								'ResidentAlreadyInCommunityError');
						}
						, error = function error(err) {
							err.name.should.equal('ResidentAlreadyInCommunityError');
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