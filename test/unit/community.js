var should = require('chai').should
	, expect = require('chai').expect
	, assert = require('chai').assert
	, config = require('../../config_test')
	, db = require('../../models/db');

	var schema = db(config);

	describe('Get all communities', function(){
		// yes, I know - it doesn't make any sense this test. - POC
		it('should not have any communities', function(done){
			schema.models.Community.all(function(err, communities) {
				assert.equal(err, null);
				assert.lengthOf(communities, 0);
				done();
			})
		});
	});