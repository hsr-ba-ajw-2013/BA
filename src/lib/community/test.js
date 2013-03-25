/* global describe, it, beforeEach */
var request = require('supertest')
	, superagent = require('superagent')
	, path = require('path')
	, app = require(path.join(process.cwd(), 'index.js'))()
	, passportMock = require(path.join(
		process.cwd(), 'src', 'shared', 'test', 'passport-mock')
	);

describe('GET /community unauthorized', function(){
	it('should respond with a 401 exception', function(done){
		request(app)
			.get('/community')
			.expect(401, done);
	});
});

describe('GET /community authorized and without community for the user'
	, function() {
	var agent = superagent.agent();

	beforeEach(function(done) {
		passportMock(app, {
			passAuthentication: true,
			userId: 1
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

	it('should redirect to /community/create with 302', function(done) {
		var req = request(app).get('/community');
		agent.attachCookies(req);
		req.expect(302, done);
	});
});