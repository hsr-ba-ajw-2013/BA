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


describe('Resident', function() {

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

	describe('GET /community/:slug/resident/new', function(){

		describe('unauthorized', function() {
			it('should redirect to /login', function(done){
				request(app)
					.get('/community/' +
							uslug(utils.randomString(42)) +'/resident/new')
					.followRedirect(false)
					.expect(302)
					.expect('Location', '/login', done);
			});
		});

		describe('authorized', function() {
			var req = request(app);

			beforeEach(function before(done) {
				req = doLogin(app, req);
				done();
			});

			describe('without shareLink (in the session)', function() {

				it('should return with 403',
					function(done) {
						req.get('/community/' +
							uslug(utils.randomString(42)) +'/resident/new')
							.followRedirect(false)
							.expect(403, done);
				});
			});

			describe.skip('with shareLink (in the session)', function() {

				beforeEach(function before(done) {
					req.get('/invite/' + community.shareLink)
						.end(function (error) {
							if (error) {
								return done(error);
							}
							return done();
						});
				});

				it('should show /community/:slug/resident/new with 200'
					, function(done) {
					req.get('/community/' +
							community.slug +'/resident/new')
						.expect(200, done);
				});
			});
		});
	});

	describe('POST /community/:slug/resident', function() {
		describe('unauthorized', function() {

			it('should redirect to /login', function(done){
				request(app)
					.post('/community/' + community.slug + '/resident')
					.followRedirect(false)
					.expect(302)
					.expect('Location', '/login', done);
			});
		});

		describe('authorized', function() {
			var req = request(app);

			beforeEach(function(done) {
				req = doLogin(app, req);
				done();
			});

			describe('without shareLink (in the session)', function() {

				it('should return 403', function(done) {
					req.post('/community/' + community.slug + '/resident')
						.form({})
						.expect(403, done);
				});
			});

			describe.skip('with shareLink (in the session)', function() {

				beforeEach(function before(done) {
					req.get('/invite/' + community.shareLink)
						.end(function (error) {
							if (error) {
								return done(error);
							}
							return done();
						});
				});

				describe('without community for the user', function() {

					it('should redirect to / ' +
						'with 302 accepting an invitation'
						, function(done) {

						req.post('/community/' +
									community.slug + '/resident')
							.followRedirect(false)
							.form({})
							.expect(302)
							.expect('Location', '/', done);
					});
				});
			});
		});
	});
});