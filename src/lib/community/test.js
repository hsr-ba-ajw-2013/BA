/* global describe, it, beforeEach, after */
var request = require('super-request')
	, path = require('path')
	, srcPath = path.join(process.cwd(),
		(process.env.COVERAGE ? 'src-cov' : 'src'))
	, app = require(path.join(process.cwd(), 'index.js'))()
	, utils = require(path.join(
			srcPath, 'shared', 'utils', 'index.js'))
	, uslug = require('uslug')
	, doLogin = require(path.join(
			srcPath, 'shared', 'test', 'passport-mock')
		).doLogin;


after(function(done) {
	app.get('db').drop().success(function() {
		done();
	}).error(function() {
		done();
	});
});

describe('Community', function() {

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

				it('should redirect to /community/new with 302',
					function(done) {
						req.get('/community')
							.followRedirect(false)
							.expect(302)
							.expect('Location', '/community/new', done);
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
						.expect('Location', '/community/new', done);

				});

				it('should not create a community with more than 255 chars'
					, function(done) {
					var communityName =
							utils.randomString(256);

					req.post('/community')
						.form({name: communityName})
						.expect(302)
						.expect('Location', '/community/new', done);
				});

				it('should redirect to /community/new with 302 ' +
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
									.expect('Location', '/community/new'
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
	});

	describe('DEL /community' ,function() {
		describe('unauthorized', function() {
			it('should redirect to /login', function(done){
				request(app)
					.del('/community')
					.followRedirect(false)
					.expect(302)
					.expect('Location', '/login', done);
			});
		});

		describe('authorized', function() {
			var req = request(app)
				, theCommunity = {};

			beforeEach(function before(done) {
				req = doLogin(app, req);
				var communityName = utils.randomString(6)
				, Community = app.get('db')
									.daoFactoryManager
									.getDAO('Community');

					req.post('/community')
						.form({name: communityName})
						.end(function(err) {
							if (err) {
								return done(err);
							}

							Community.find({name: communityName})
								.success(function findSuccess(community) {
									theCommunity = community;
									return done();
								})
								.error(function findError(error) {
									return done(error);
								});
						});
			});

			describe('as Admin of the community', function() {
				it('should set the property "enabled" ' +
					'of the community to "false"', function(done) {
					req.del('/community')
						.form({community: theCommunity.slug})
						.expect(302)
						.expect('Location', '/', done);
				});
			});
		});
	});
});