/* global describe, it, beforeEach, after */
var request = require('super-request')
	, path = require('path')
	, app = require(path.join(process.cwd(), 'index.js'))()
	, utils = require(path.join(
			process.cwd(), 'src', 'shared', 'utils', 'index.js'))
	, uslug = require('uslug')
	, doLogin = require(path.join(
			process.cwd(), 'src', 'shared', 'test', 'passport-mock')
		).doLogin;

after(function(done) {
	app.get('db').drop().success(function() {
		done();
	}).error(function() {
		done();
	});
});

describe('Task', function() {
	/*var community;*/

	/*beforeEach(function before(done) {
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
	});*/

	describe('GET /community/:slug/task', function(){
		describe('unauthorized', function() {
			it('should redirect to /login', function(done){
				request(app)
					.get('/community/ASDF/task')
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
						req.get('/community/ASDF/task')
							.followRedirect(false)
							.expect(302)
							.expect('Location', '/community/new', done);
				});
			});

			describe('with community for the user', function() {
				var req = request(app)
					, name = utils.randomString(6)
					, slug = uslug(name);

				beforeEach(function before(done) {
					req = doLogin(app, req);

					req.post('/community')
						.form({name: name})
						.end(function(err) {
							if (err) {
								return done(err);
							}
							return done();
						});
				});

				it('should show /community/:slug/task with 200'
					, function(done) {

					req.get('/community/' + slug + '/task')
						.expect(200, done);
				});

				it('should return a 404 when accessing a not existing task',
					function(done) {

					req.get('/community/' + slug + '/task/1337')
						.expect(404, done);
				});
			});
		});
	});

	describe('POST /community/:slug/task', function() {
		describe('unauthorized', function() {
			it('should not create a task and return 302', function(done) {

				var req = request(app)
							.post('/community/ASDF/task')
					, taskData = {
						name: utils.randomString(12)
						, description: utils.randomString(12)
						, reward: 3
						, dueDate: new Date()
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
							name: utils.randomString(12)
							, description: utils.randomString(12)
							, reward: 3
							, dueDate: new Date(new Date().getTime() +
								24 * 60 * 60)
						};

						req.post('/community/ASDF/task')
							.form(taskData)
							.followRedirect(false)
							.expect(302)
							.expect('Location', '/community/new', done);
				});
			});

			describe('with community for the user', function() {

				var req = request(app)
					, communityName = utils.randomString(6)
					, slug = uslug(communityName);

				beforeEach(function before(done) {
					req = doLogin(app, req);

					req.post('/community')
						.form({name: communityName})
						.end(function(err) {
							if (err) {
								return done(err);
							}
							return done();
						});
				});

				it('should create a task and redirect to /community/:slug/task',
					function(done) {
					var taskData = {
						name: utils.randomString(12)
						, description: utils.randomString(12)
						, reward: 3
						, dueDate: new Date(new Date().getTime() +
							24 * 60 * 60)
					};
					req.post('/community/' + slug + '/task')
						.form(taskData)
						.followRedirect(false)
						.expect(302)
						.expect('Location', '/community/' + slug + '/task/.',
							done);
				});

				it('should return a 404 when accessing the task with' +
					'wrong community', function(done) {
					req.get('/community/ASDF/task/1/check')
						.expect(404, done);
				});

				it.skip('should return a 405 when accessing a task on' +
					' a community which does not belong to the user',
					function() {
					//TODO
				});
			});
		});
	});

	describe('UPDATE /community/slug/task/:id', function() {
		describe('authorized', function() {
			describe('with an existing, not fulfilled task', function() {
				var communityName = utils.randomString(6)
					, slug = uslug(communityName)
					, taskId = 0
					, req = request(app)
					, taskData = {
						name: utils.randomString(12)
						, description: utils.randomString(12)
						, reward: 3
						, dueDate: new Date(new Date().getTime() +
							24 * 60 * 60)
					};

				beforeEach(function before(done) {
					req = doLogin(app, req);


					req.post('/community')
						.form({name: communityName})
						.end(function(err) {
							if (err) {
								return done(err);
							}

							req.post('/community/' + slug + '/task')
								.json(taskData)
								.end(function(err, res) {
									if(err) {
										return done(err);
									}
									var locationHeader = res.headers.location,
										lastSlash =
											locationHeader.lastIndexOf('/');

									taskId = locationHeader
											.substring(lastSlash + 1);
									done();
								});
						});
				});

				it('should update the task', function update(done) {
					var updateData = taskData;
					updateData.name = 'Updated!';

					req.put('/community/' + slug + '/task/' + taskId)
						.json(updateData)
						.end(function(err, res) {
							if(err) {
								return done(err);
							}
							res.body.name.should.equal(updateData.name);
							done();
						});
				});
			});
		});
	});

	describe('DELETE /community/:slug/task/:id', function() {
		describe('authorized', function() {
			describe('with an existing, not fulfilled task', function() {
				var communityName = utils.randomString(6)
					, slug = uslug(communityName)
					, taskId = 0
					, req = request(app);

				beforeEach(function before(done) {
					req = doLogin(app, req);


					req.post('/community')
						.form({name: communityName})
						.end(function(err) {
							if (err) {
								return done(err);
							}
							var taskData = {
								name: utils.randomString(12)
								, description: utils.randomString(12)
								, reward: 3
								, dueDate: new Date(new Date().getTime() +
									24 * 60 * 60)
							};

							req.post('/community/' + slug + '/task')
								.json(taskData)
								.end(function(err, res) {
									if(err) {
										return done(err);
									}
									var locationHeader = res.headers.location,
										lastSlash =
											locationHeader.lastIndexOf('/');

									taskId = locationHeader
											.substring(lastSlash + 1);
									done();
								});
						});
				});

				it('should delete the task', function(done) {
					req.del('/community/' + slug + '/task/' + taskId)
						.json({})
						.expect(204, done);
				});
			});
		});
	});
});