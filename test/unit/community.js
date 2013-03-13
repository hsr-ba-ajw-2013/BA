var chai = require('chai')
	, expect = chai.expect
	, config = require('../../config_test')
	, db = require('../../lib/db');

	chai.should();

	var sequelize = db(config);
	describe('Get all communities', function(){
		// yes, I know - it doesn't make any sense this test. - POC
		it('should not have any communities', function(done){
			(function() {
				sequelize.daoFactoryManager.getDAO('Community').all().success(function(communities) {
					communities.should.have.length(0);
					done();
				}).error(function(error) {
					throw(error);
				})
			}).should.not.throw();
		});
	});