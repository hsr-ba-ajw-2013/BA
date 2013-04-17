/* global describe, it, beforeEach */
var request = require('super-request')
	, path = require('path')
	, app = require(path.join(process.cwd(), 'index.js'))()
	, utils = require(path.join(
			process.cwd(), 'src', 'shared', 'utils', 'index.js'))
	, doLogin = require(path.join(
			process.cwd(), 'src', 'shared', 'test', 'passport-mock')
		).doLogin;

describe('Home', function() {

	describe ('GET /', function() {
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
			var req = request(app);

			describe('without a community for the user', function() {

				beforeEach(function before(done) {
					req = doLogin(app, req);
					done();
				});

				it('should redirect to /community/new with 302'
					, function(done) {

					req.get('/')
						.expect(302)
						.followRedirect(false)
						.expect('Location', '/community/new', done);
				});

			});

			describe('with a community for the user', function() {

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

				it('should show / with 200', function(done) {
					req.get('/')
						.expect(200, done);
				});

			});

		});
	});

	describe('GET /invite/:shareLink', function() {
		describe('unauthorized', function() {
			describe('with an invalid shareLink', function(){

				it('should redirect to /login', function(done){
					request(app)
						.get('/invite/' +
							utils.randomString(42))
						.followRedirect(false)
						.expect(302)
						.expect('Location', '/login', done);
				});
			});

			describe('with a valid shareLink'
				, function() {

				it('should redirect to /login', function(done){
					request(app)
						.get('/invite/' +
							utils.randomString(42))
						.followRedirect(false)
						.expect(302)
						.expect('Location', '/login', done);
				});
			});
		});

		describe('authorized', function() {


			describe('with a community for the user', function() {

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

				describe('with an invalid shareLink', function() {

					it('should redirect to /', function(done){
						req.get('/invite/' +
								utils.randomString(42))
							.followRedirect(false)
							.expect(302)
							.expect('Location', '/', done);
					});
				});

				describe('with a valid shareLink', function() {

					it('should redirect to /', function(done){

						req.get('/invite/' +
								utils.randomString(42))
							.expect(302)
							.followRedirect(false)
							.expect('Location', '/', done);
					});
				});
			});

			describe('without a community for the user', function() {
				var req = request(app);

				beforeEach(function before(done) {
					req = doLogin(app, req);
					done();
				});

				describe('with an invalid shareLink', function() {

					it('should redirect to /', function(done){

						req.get('/invite/' +
								utils.randomString(42))
							.followRedirect(false)
							.expect(302)
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