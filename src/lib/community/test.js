/* global describe, it, beforeEach */
var request = require('supertest')
	, superagent = require('superagent')
	, path = require('path')
	, app = require(path.join(process.cwd(), 'index.js'))()
	, passportMock = require(path.join(
		process.cwd(), 'src', 'shared', 'test', 'passport-mock')
	)
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

	beforeEach(function(done) {
		passportMock(app, {
			passAuthentication: true,
			user: {
				name: 'CommunityTest'
				, facebookId: Math.round(1000*(Math.random()+1))
			}
		});
		request(app)
			.get('/mock/login')
			.end(function(err, result) {
				if (!err) {
					agent.saveCookies(result.res);
					done();
				} else {
					done(err);
				}
			});
	});

	it('should redirect to /community/./new with 302', function(done) {
		var req = request(app).get('/community');
		agent.attachCookies(req);
		req.expect(302)
			.expect('Location', '/community/./new', done);
	});
});

describe('GET /community authorized and with community for the user'
	, function() {
	var agent = superagent.agent();

	beforeEach(function(done) {
		passportMock(app, {
			passAuthentication: true,
			user: {
				name: 'CommunityTest'
				, facebookId: Math.round(1000*(Math.random()+1))
			}
		});
		request(app)
			.get('/mock/login')
			.end(function(err, result) {
				if (!err) {
					agent.saveCookies(result.res);

					var communityName = randomString();
					//console.log(communityName);

					request(app)
						.post('/community')
						.send({name: communityName})
						.end(function(err) {
							if (err) {
								done(err);
							}
							done();
						});

				} else {
					done(err);
				}
			});
	});

	it.skip('should show /community with 200', function(done) {
		var req = request(app).get('/community');
		agent.attachCookies(req);

		req.expect(200, done);
	});
});


describe('POST /community authorized'
	, function() {
	var agent = superagent.agent();

	beforeEach(function(done) {
		passportMock(app, {
			passAuthentication: true,
			user: {
				name: 'CommunityTest'
				, facebookId: Math.round(1000*(Math.random()+1))
			}
		});
		request(app)
			.get('/mock/login')
			.end(function(err, result) {
				if (!err) {
					agent.saveCookies(result.res);
					done();
				} else {
					done(err);
				}
			});
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

	it.skip('should create a community', function(done) {
		done();
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
});
