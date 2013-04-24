/* global describe, it, beforeEach */
var request = require('super-request')
	, path = require('path')
	, app = require(path.join(process.cwd(), 'index.js'))()
	, utils = require(path.join(
			process.cwd(), 'src', 'shared', 'utils', 'index.js'))
	, uslug = require('uslug')
	, doLogin = require(path.join(
			process.cwd(), 'src', 'shared', 'test', 'passport-mock')
		).doLogin;

describe('Task', function() {

	var community;

	beforeEach(function before(done) {
		var communityName = utils.randomString(6)
			, Community = app.get('db')
							.daoFactoryManager
							.getDAO('Community');

		Community.create({name: communityName
							, slug: uslug(communityName)
							, shareLink: utils.randomString(12)})
			.success(function createResult(theCommunity) {
				community = theCommunity;
				done();
			})
			.error(function createError(errors) {
				done(errors);
			});
	});

	describe('GET /community/:slug/task', function(){
		describe('unauthorized', function() {
			it('should redirect to /login', function(done){
				request(app)
					.get('/community/' + community.slug + '/task')
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
						req.get('/community/' + community.slug + '/task')
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

				it('should show /community/:slug/task with 200'
					, function(done) {

					req.get('/community/' + community.slug + '/task')
						.expect(200, done);
				});
			});
		});
	});

	describe('POST /community/:slug/task', function() {
		describe('unauthorized', function() {
			it('should not create a task and return 302', function(done) {

				var req = request(app)
							.post('/community/' + community.slug + '/task')
					, taskData = {
						txtTask: utils.randomString(12)
						, txtDescription: utils.randomString(12)
						, txtReward: 3
						, txtDueDate: new Date()
					};


				req
					.followRedirect(true)
					.form(taskData)
					.expect(302, done);
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

						var taskData = {
							txtTask: utils.randomString(12)
							, txtDescription: utils.randomString(12)
							, txtReward: 3
							, txtDueDate: new Date()
						};

						req.post('/community/' + community.slug + '/task')
							.form(taskData)
							.followRedirect(false)
							.expect(302)
							.expect('Location', '/community/new', done);
				});
			});

			describe.skip('with community for the user', function() {

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
});