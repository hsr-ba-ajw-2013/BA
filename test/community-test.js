var request = require('supertest')
	, path = require('path')
	, app = require(path.join(__dirname, '..', '..', 'index.js')).app
	, passport = require('passport');

	describe('GET /community unauthorized', function(){
		it('should respond with 401', function(done){
			request(app)
				.get('/community')
				.expect(401, done);
		});
	});

	describe('GET /community authorized and without community for the user', function() {
		it('should redirect to /community/create with 302', function(done) {
			var strategy = DummyStrategy,
				agent = request(app).agent();

			passport.use(new strategy(true));

			app.get('/dummy/login', passport.authenticate('dummy'));

			agent.get('/dummy/login')
				.withCredentials()
				.end(function(err, result) {
					if (!err) {
						agent.get('/community')
							.expect(302, done);
					} else {
						console.log('fo');
						done(err);
					}
				});
		});
	});


function DummyStrategy(passAuthentication) {
	passport.Strategy.call(this);
	this.name = 'dummy';
	this.passAuthentication = passAuthentication;
}

DummyStrategy.prototype.authenticate = function authenticate(req) {
	this.passAuthentication ? this.pass() : this.error('Unauthorized');
}