/* global describe, it, beforeEach */
var request = require('supertest')
	, superagent = require('superagent')
	, path = require('path')
	, app = require(path.join(process.cwd(), 'index.js'))()
	, crypto = require('crypto')
	, uslug = require('uslug')
	, doLogin = require(path.join(
			process.cwd(), 'src', 'shared', 'test', 'passport-mock')
		).doLogin;

describe('Community', function() {

	describe('GET /community', function(){
		describe('unauthorized', function() {
			it('should redirect to /login', function(done){
				request(app)
					.get('/community')
					.expect(302)
					.expect('Location', '/login', done);
			});
		});

		describe('authorized', function() {
			describe('without community for the user', function() {
				var agent = superagent.agent();

				beforeEach(function before(done) {
					doLogin(app, agent, done);
				});

				it('should redirect to /community/./new with 302',
					function(done) {
						var req = request(app).get('/community');
						agent.attachCookies(req);

						req.expect(302)
							.expect('Location', '/community/./new', done);
				});
			});

			describe('with community for the user', function() {
				var agent = superagent.agent();

				beforeEach(function before(done) {
					doLogin(app, agent, function afterLogin() {
						var communityName =
							crypto.pseudoRandomBytes(6).toString('hex')
							, req = request(app)
								.post('/community');

						agent.attachCookies(req);
						req.send({name: communityName})
							.end(function(err) {
								if (err) {
									return done(err);
								}
								return done();
							});
					});
				});

				it('should show /community with 200', function(done) {

					var req = request(app).get('/community');
					agent.attachCookies(req);

					req.expect(200, done);
				});
			});
		});
	});

	describe('POST /community', function() {
		describe('unauthorized', function() {
			it('should not create a community and return 401', function(done) {

				var req = request(app)
							.post('/community')
					, communityName =
						crypto.pseudoRandomBytes(12).toString('hex');

				req.send({name: communityName})
					.expect(401, done);
			});
		});

		describe('authorized', function() {
			describe('without community for the user', function() {
				var agent = superagent.agent();

				beforeEach(function(done) {
					doLogin(app, agent, done);
				});

				it('should redirect to /community/[slug]/invite ' +
					'with 302 after creating a community'
					, function(done) {
					var req = request(app)
								.post('/community')
						, communityName =
							crypto.pseudoRandomBytes(6).toString('hex');
					agent.attachCookies(req);

					req.send({name: communityName})
						.expect(302)
						.expect('Location', '/community/' +
							uslug(communityName) + '/invite', done);
				});

				it('should not create a community with an empty name string'
					, function(done) {
					var req = request(app)
								.post('/community');
					agent.attachCookies(req);

					req.send({name: ''})
						.expect(302)
						.expect('Location', '/community/./new', done);

				});

				it('should not create a community with more than 255 chars'
					, function(done) {
					var req = request(app)
								.post('/community')
						, communityName =
							crypto.pseudoRandomBytes(200).toString('hex');
					agent.attachCookies(req);

					req.send({name: communityName})
						.expect(302)
						.expect('Location', '/community/./new', done);
				});

				it('should redirect to /community/./new with 302 ' +
					'if the community name already exists',
					function(done) {
						var req = request(app)
									.post('/community')
							, communityName =
								crypto.pseudoRandomBytes(6).toString('hex')
							, Community = app.get('db')
											.daoFactoryManager
											.getDAO('Community');

						agent.attachCookies(req);

						Community.create({name: communityName})
							.success(function createResult() {
								req.send({name: communityName})
								.expect(302)
								.expect('Location', '/community/./new', done);
							})
							.error(function createError(errors) {
								done(errors);
							});
				});
			});

			describe('with community for the user', function() {
				var agent = superagent.agent();

				beforeEach(function(done) {
					doLogin(app, agent, function afterLogin() {
						var communityName =
							crypto.pseudoRandomBytes(6).toString('hex')
							, req = request(app)
								.post('/community');
						agent.attachCookies(req);

						req.send({name: communityName})
							.end(function(err) {
								if (err) {
									done(err);
								}
								done();
							});
					});
				});

				it('should redirect to /community with 302',function(done) {
					var req = request(app)
									.post('/community')
							, communityName =
								crypto.pseudoRandomBytes(6).toString('hex');
						agent.attachCookies(req);

						req.send({name: communityName})
							.expect(302)
							.expect('Location', '/community', done);
				});
			});
		});
	});
});