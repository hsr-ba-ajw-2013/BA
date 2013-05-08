/* global describe, it, beforeEach, after */
var request = require('super-request')
	, path = require('path')
	, app = require(path.join(process.cwd(), 'index.js'))()
	, srcPath = path.join(process.cwd(),
		(process.env.COVERAGE ? 'src-cov' : 'src'))
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

describe('Rank', function() {

	describe('GET /community/:slug/rank', function(){
		describe('unauthorized', function() {
			it('should redirect to /login', function(done){
				request(app)
					.get('/community/ASDF/rank')
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
						req.get('/community/ASDF/rank')
							.followRedirect(false)
							.expect(302)
							.expect('Location', '/community/new', done);
				});
			});

			describe.skip('with community for the user', function() {
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

				it('should show /community/:slug/rank with 200'
					, function(done) {

					req.get('/community/' + slug + '/rank')
						.expect(200, done);
				});
			});
		});
	});
});