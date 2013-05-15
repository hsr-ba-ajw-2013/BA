"use srict"

/* Setup Chai & ShouldJS: */
var chai = require('chai');
chai.should();

/* Config is kept as global object during running the tests! */
config = require('../config.test.js');

/**
 * Check if sqlite stores onto disk and remove db if yes before running tests.
 */
if (config.db.options.dialect === 'sqlite'
	&& config.db.options.storage && config.db.options.storage !== ':memory:') {
	try {
		require('fs').unlinkSync(config.db.options.storage);
	} catch(e) {
		// silent fail
	}
}

// db as well global
var path = require('path')
	, srcPath = path.join(process.cwd(),
		(process.env.COVERAGE ? 'src-cov' : 'src'));
db = require(path.join(srcPath, 'server', 'middleware', 'db'))(null, config)