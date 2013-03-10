var request = require('supertest')
	, path = require('path')
	, app = require(path.join(__dirname, '..', '..', 'app.js')).app
	, should = require('chai').should
	, expect = require('chai').expect
	, assert = require('chai').assert;

	describe('GET /api/community', function(){
		it('should respond with json', function(done){
			request(app)
				.get('/api/community')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});