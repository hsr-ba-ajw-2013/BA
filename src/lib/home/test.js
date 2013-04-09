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
				var agent = superagent.agent();

				beforeEach(function before(done) {
					doLogin(app, agent, done);
				});

				it.skip('should redirect to ' + '/community/:slug/resident/new',
					function() {

				});
			});
		});

		describe('authorized', function() {
			describe('with a community for the user', function() {
				describe('with an invalid shareLink', function() {

					it.skip('should redirect to /', function(){

					});
				});

				describe('with a valid shareLink', function() {
					it.skip('should redirect to /', function(){

					});
				});
			});

			describe('without a community for the user', function() {
				describe('with an invalid shareLink', function() {
					it.skip('should redirect to /', function(){

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