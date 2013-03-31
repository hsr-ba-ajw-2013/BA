/* global describe, it, beforeEach */
var request = require('supertest')
	, superagent = require('superagent')
	, path = require('path')
	, app = require(path.join(process.cwd(), 'index.js'))()
	, doLogin = require(path.join(
			process.cwd(), 'src', 'shared', 'test', 'passport-mock')
		).doLogin
	, randomString = function randomString(size) {
		var text = ""
			, possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
				"abcdefghijklmnopqrstuvwxyz0123456789";

		size = size || 12;

		for( var i=0; i < size; i++ ) {
			text += possible.charAt(
						Math.floor(Math.random() * possible.length));
		}
		return text;
	};

describe('GET /community unauthorized', function(){
	it('should redirect to /login', function(done){
		request(app)
			.get('/community')
			.expect(302)
			.expect('Location', '/login', done);
	});
});

describe('GET /community authorized and without community for the user'
	, function() {
	var agent = superagent.agent();

	beforeEach(function before(done) {
		doLogin(app, agent, done);
	});

	it('should redirect to /community/./new with 302', function(done) {
		var req = request(app).get('/community');
		agent.attachCookies(req);
		req.expect(302)
			.expect('Location', '/community/./new', done);
	});
});

describe('POST /community authorized and without community for the user'
	, function() {
	var agent = superagent.agent();

	beforeEach(function(done) {
		doLogin(app, agent, done);
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
			, communityName = randomString(256);
		agent.attachCookies(req);

		req.send({name: communityName})
			.expect(302)
			.expect('Location', '/community/./new', done);
	});

	it('should redirect to /community with 302 after creating a community'
		, function(done) {
		var req = request(app)
					.post('/community')
			, communityName = randomString(12);
		agent.attachCookies(req);

		req.send({name: communityName})
			.expect(302)
			.expect('Location', '/community', done);
	});

	it('should redirect to /community/./new with 302 ' +
		'if the community name already exists',
		function(done) {
			var req = request(app)
						.post('/community')
				, communityName = randomString(12)
				, Community = app.get('db')
								.daoFactoryManager.getDAO('Community');

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

describe('POST /community authorized and with community for the user'
	, function() {

	var agent = superagent.agent();

	beforeEach(function(done) {
		doLogin(app, agent, function afterLogin() {
			var communityName = randomString();

			request(app)
				.post('/community')
				.send({name: communityName})
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
				, communityName = randomString();
			agent.attachCookies(req);

			req.send({name: communityName})
				.expect(302)
				.expect('Location', '/community', done);
	});

});

describe('GET /community authorized and with community for the user'
	, function() {
	var agent = superagent.agent()
		, result;

	beforeEach(function before(done) {
		doLogin(app, agent, function afterLogin() {
			var communityName = randomString();

			request(app)
				.post('/community')
				.send({name: communityName})
				.end(function(err) {
					if (err) {
						done(err);
					}

					var req = request(app).get('/community');
					agent.attachCookies(req);
					req.end(function(err, res) {
						if (err) {
							done(err);
						}

						result = res;

						done();

					});
				});
		});
	});

	it.skip('should show /community with 200', function(done) {

		result.should.have.status(200);
		result.should.have.location('/community');

		done();
	});
});
