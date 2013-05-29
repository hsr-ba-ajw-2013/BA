/* global config, describe, before, it */
var join = require('path').join
	, srcPath = join(process.cwd(),
		(process.env.COVERAGE ? 'src-cov' : 'src'))
	, _ = require('underscore')
	, controller = require(join(srcPath, 'server', 'api', 'rank',
		'controller'))
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
	describe('in List for Community', function() {
		var RESIDENTS = 3
			, TASKS = 20
			, residents = []
			, community
			, tasks = [];

		before(function(done) {
			testUtils.createCommunity(communityDao
				, function(err, createdCommunity) {
				if(err) {
					return done(err);
				}
				community = createdCommunity;
				testUtils.createAmountOfResidents(0, RESIDENTS, residentDao
					, function ok(err, createdResidents) {
					if(err) {
						return done(err);
					}
					residents = createdResidents;
					testUtils.createAmountOfTasks(0, TASKS, taskDao, residents
						, function(err, createdTasks) {
						if(err) {
							return done(err);
						}
						tasks = createdTasks;
						done();
					});
				}, community);
			});
		});

		it('should display the correct ranking', function(done) {
			var req = testUtils.req({
				user: residents[0]
				, community: community
			});
			var success = function success(ranks) {
					var previousRank
						, ok = true;
					_.each(ranks, function(rank) {
						if(!ok) {
							return;
						}
						if(!previousRank) {
							previousRank = rank;
						} else {
							if(previousRank.points < rank.points) {
								ok = false;
								return done(new Error('Invalid sorting.'));
							}
							previousRank = rank;
						}
					});
					if (ok === true) {
						done();
					}
				}
				, error = function error(err) {
					console.log(err);
					done(new Error(err));
				}
				, functionScope = {
					req: req
					, app: app
					, dataStore: new testUtils.DataStore()
				}
				, scopedRanking =
					controller.getRankingListForCommunity.bind(functionScope
						, success, error);

			scopedRanking();
		});
	});
});