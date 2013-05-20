/* global config, describe, before */
// it, beforeEach, expect, should
var join = require('path').join
	, srcPath = join(process.cwd(),
		(process.env.COVERAGE ? 'src-cov' : 'src'))
	//, controller = require(join(srcPath, 'server', 'api', 'community',
	//	'controller'))
	//, utils = require(join(srcPath, 'server', 'api', 'utils'))
	//, errors = require(join(srcPath, 'server', 'api', 'errors'))
	, testUtils = require(join(srcPath, 'server', 'api', 'utils', 'test'))
	, app
	, communityDao
	, residentDao
	, taskDao
	, db;

testUtils.initDb(config, before, function(initializedDb) {
	// setup test-local variables as defined at the top of the file.
	// those are all dependant on a synced db.
	db = initializedDb;
	residentDao = db.daoFactoryManager.getDAO('Resident');
	communityDao = db.daoFactoryManager.getDAO('Community');
	taskDao = db.daoFactoryManager.getDAO('Task');
	app = testUtils.app(db);
});

describe('Rank', function() {

});