var request = require('supertest')
	, path = require('path')
	, app = require(path.join(__dirname, '..', '..', 'app.js')).app
	, should = require('chai').should
	, expect = require('chai').expect
	, assert = require('chai').assert;

	describe('GET /community', function(){
		it('should respond with 401', function(done){
			request(app)
				.get('/community')
				.expect(401, done);
		});
	});