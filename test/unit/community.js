var should = require('chai').should
	, expect = require('chai').expect
	, assert = require('chai').assert
	, config = require('../../config_test')
	, db = require('../../lib/db');

	var sequelize = db(config);
	describe('Get all communities', function(){
		// yes, I know - it doesn't make any sense this test. - POC
		it('should not have any communities', function(done){
			sequelize.daoFactoryManager.getDAO('Community').all().success(function(communities) {
				assert.lengthOf(communities, 0);
				done();
			}).error(function(error) {
				assert.equal(error, null);
				done();
			});
		});
	});