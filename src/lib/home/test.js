/* global describe, it, beforeEach */
var request = require('supertest')
	, superagent = require('superagent')
	, path = require('path')
	, app = require(path.join(process.cwd(), 'index.js'))()
	, crypto = require('crypto')
	, doLogin = require(path.join(
			process.cwd(), 'src', 'shared', 'test', 'passport-mock')
		).doLogin;

describe('Home', function() {

	describe('GET /invite/:shareLink', function() {
		describe('unauthorized', function() {
			describe('with an invalid shareLink', function(){
				it('should redirect to /login', function(done){
					request(app)
						.get('/invite/' +
							crypto.pseudoRandomBytes(42).toString('hex'))
						.expect(302)
						.expect('Location', '/login', done);
				});
			});

			describe('with a valid shareLink'
				, function() {

				it('should redirect to /login', function(done){
					request(app)
						.get('/invite/' +
							crypto.pseudoRandomBytes(42).toString('hex'))
						.expect(302)
						.expect('Location', '/login', done);
				});
			});
		});

		describe('authorized', function() {

			var agent = superagent.agent();

			describe('with a community for the user', function() {

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

				describe('with an invalid shareLink', function() {

					it('should redirect to /', function(done){
						var req = request(app).get('/invite/' +
								crypto.pseudoRandomBytes(42).toString('hex'));
						agent.attachCookies(req);

						req.expect(302)
							.expect('Location', '/', done);
					});
				});

				describe('with a valid shareLink', function() {

					it('should redirect to /', function(done){
						var req = request(app).get('/invite/' +
								crypto.pseudoRandomBytes(42).toString('hex'));
						agent.attachCookies(req);

						req.expect(302)
							.expect('Location', '/', done);
					});
				});
			});

			describe('without a community for the user', function() {

				beforeEach(function before(done) {
					doLogin(app, agent, done);
				});

				describe('with an invalid shareLink', function() {

					it('should redirect to /', function(done){
						var req = request(app).get('/invite/' +
								crypto.pseudoRandomBytes(42).toString('hex'));
						agent.attachCookies(req);

						req.expect(302)
							.expect('Location', '/', done);
					});
				});

				describe('with a valid shareLink', function() {

					it.skip('should redirect to ' +
						'/community/:slug/resident/new', function(){

					});
				});
			});
		});
	});
});