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
			/** Function: createResident
			 * Create max amount of resident in a recursive function.
			 * If max is reached, successCallback is called.
			 *
			 * Parameters:
			 *   (Integer) i - Current resident number
			 *   (Integer) max - Max. number of residents to create
			 *   (Function) successCallback - Callback after max. is reached.
			 */
			function createResident(i, max, successCallback) {
				testUtils.createResident(residentDao
					, function(err, createdResident) {
					if(err) {
						return done(err);
					}
					createdResident.setCommunity(community).success(function() {
						residents[i] = createdResident;
						if(i < max) {
							return createResident(++i, max, successCallback);
						}
						successCallback();
					}).error(done);
				});
			}

			/** Function: createTask
			 * Create max amount of tasks in a recursive function.
			 * If max is reached, successCallback is called.
			 *
			 * Parameters:
			 *   (Integer) i - Current task number
			 *   (Integer) max - Max. number of tasks to create
			 *   (Function) successCallback - Callback after max. is reached.
			 */
			function createTask(i, max, successCallback) {
				var resident = residents[i % RESIDENTS]
					, fulfilledAtDate = new Date(new Date() *
						24 * 3600 * (i % 2 + 1));
				testUtils.createTask(taskDao, resident, community
					, function ok(err, createdTask) {
					if(err) {
						return done(err);
					}
					createdTask.setFulfillor(resident).success(function() {
						createdTask.fulfilledAt = fulfilledAtDate;
						createdTask.save().success(function() {
							tasks[i] = createdTask;
							if(i < max) {
								return createTask(++i, max, successCallback);
							}
							successCallback();
						}).error(done);
					}).error(done);
				});
			}

			testUtils.createCommunity(communityDao
				, function(err, createdCommunity) {
				if(err) {
					return done(err);
				}
				community = createdCommunity;
				createResident(0, RESIDENTS, function ok() {
					createTask(0, TASKS, function() {
						done();
					});
				});
			});
		});

		it('should display the correct ranking', function(done) {
			var req = testUtils.req({ user: residents[0] });
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
					, community: community
					, dataStore: new testUtils.DataStore()
				}
				, scopedRanking =
					controller.getRankingListForCommunity.bind(functionScope
						, success, error);

			scopedRanking();
		});
	});
});