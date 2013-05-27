/** Module: Api.Utils.Test
 * Test utilities for mocking API.
 *
 * Exports:
 *   - req
 *   - app
 */
var _ = require('underscore')
	, join = require('path').join
	, srcPath = join(process.cwd(),
		(process.env.COVERAGE ? 'src-cov' : 'src'))
	, utils = require(join(srcPath, 'server', 'api', 'utils'));

/** Function: initDb
 * Initializes the Database in a before()-Function
 *
 * Parameters:
 *   (Function) before - Before handler
 *   (Function) successHandler - Success handler
 */
function initDb(config, before, successHandler) {
	before(function(done) {
		require(join(srcPath, 'server', 'middleware', 'db'))(null, config,
			function(err, connectedDb) {
				if(err) {
					return done(err);
				}
				successHandler(connectedDb);
				done();
		});
	});
}

/** Function: createResident
 * Create a random resident
 *
 * Parameters:
 *   (ResidentDao) residentDao - Resident Data Access Object
 *   (Function) done - Callback
 */
function createResident(residentDao, done) {
	residentDao.create({
		name: utils.randomString(12)
		, facebookId: utils.randomInt()
	}).success(function success(createdResident) {
		done(null, createdResident);
	}).error(function error(err) {
		done(err);
	});
}

/** Function: createCommunity
 * Create a random community
 *
 * Parameters:
 *   (CommunityDao) communityDao - Community Data Access Object
 *   (Function) done - Callback
 */
function createCommunity(communityDao, done) {
	var name = utils.randomString(12);
	communityDao.create({
		name: name
		, slug: name
		, shareLink: name
	}).success(function success(createdCommunity) {
		done(null, createdCommunity);
	}).error(function error(err) {
		done(err);
	});
}

/** Function: createTask
 * Creates a random task and assignes it to the specified resident/community.
 *
 * Parameters:
 *   (TaskDao) taskDao - Task Data Access Object
 *   (Resident) resident - Resident
 *   (Community) community - Community
 *   (Function) done - Callback
 */
function createTask(taskDao, resident, community, done) {
	var name = utils.randomString(12)
		, description = utils.randomString(100)
		// between 1 and 5
		, reward = Math.ceil(Math.random() * 5)
		, dueDate = new Date(new Date().getTime() +
							(24 * 3600 * 1000))
		, errorHandler = function(err) {
			done(err);
		};

	taskDao.create({
		name: name
		, description: description
		, reward: reward
		, dueDate: dueDate
	}).success(function success(createdTask) {
		createdTask.setCreator(resident).success(function saved() {
			createdTask.setCommunity(community).success(function comSaved() {
				done(null, createdTask);
			}).error(errorHandler);
		}).error(errorHandler);
	}).error(errorHandler);
}

/** PrivateFunction: createAndAssignCommunity
 * Creates a community and assigns the resident to it.
 *
 * Parameters:
 *   (CommunityDao) communityDao - Community Data Access Object
 *   (Resident) resident - Resident
 *   (Integer) wrongCommunityId - if specified, will assign a wrong
 *                                community id to the resident
 *   (Function) done - Callback after creating
 */
function createAndAssignCommunity(communityDao, resident, wrongCommunityId
	, done) {
	createCommunity(communityDao, function(err, createdCommunity) {
		if(err) {
			return done(err);
		}
		resident.isAdmin = true;
		resident.CommunityId = wrongCommunityId ||
									createdCommunity.id;
		resident.save().success(function saved() {
			done(null, createdCommunity);
		}).error(function error(err) {
			done(err);
		});
	});
}

/** Function: createAmountOfResidents
 * Create max amount of resident in a recursive function.
 * If max is reached, successCallback is called.
 *
 * Parameters:
 *   (Integer) i - Current resident number
 *   (Integer) max - Max. number of residents to create
 *   (ResidentDao) residentDao - ResidentDao
 *   (Function) successCallback - Callback after max. is reached.
 *   (Array) residents - [Optional] Array to store the created residents in
 */
function createAmountOfResidents(i, max, residentDao, successCallback, community
	, residents) {
	residents = residents || [];
	createResident(residentDao
		, function(err, createdResident) {
		if(err) {
			return successCallback(err);
		}
		var cb = function() {
			residents[i] = createdResident;
			if(i < max) {
				return createAmountOfResidents(++i, max, residentDao
					, successCallback, community, residents);
			}
			successCallback(null, residents);
		};
		if(community) {
			createdResident.setCommunity(community).success(cb)
			.error(successCallback);
		} else {
			cb();
		}
	});
}

/** Function: createAmountOfTasks
 * Create max amount of tasks in a recursive function.
 * If max is reached, successCallback is called.
 *
 * Parameters:
 *   (Integer) i - Current task number
 *   (Integer) max - Max. number of tasks to create
 *   (TaskDao) taskDao - Task DAO
 *   (Array) residents - Residents array to which the tasks will be evenly
 *                       (more or less) assigned as creators.
 *   (Function) successCallback - Callback after max. is reached.
 *   (Array) tasks - [Optional] Array to store the created tasks in
 */
function createAmountOfTasks(i, max, taskDao, residents, successCallback
	, tasks) {
	var resident = residents[i % residents.length]
		, fulfilledAtDate = new Date(new Date().getTime() +
								(24 * 3600 * 1000 * (i % 2 + 1)));
	tasks = tasks || [];
	resident.getCommunity().success(function(community) {
		if(!community) {
			successCallback(new Error('Resident needs a community assigned.'));
		}
		createTask(taskDao, resident, community
			, function ok(err, createdTask) {
			if(err) {
				return successCallback(err);
			}
			createdTask.setFulfillor(resident).success(function() {
				createdTask.fulfilledAt = fulfilledAtDate;
				createdTask.save().success(function() {
					tasks[i] = createdTask;
					if(i < max) {
						return createAmountOfTasks(++i, max, taskDao, residents
							, successCallback, tasks);
					}
					successCallback(null, tasks);
				}).error(successCallback);
			}).error(successCallback);
		});
	}).error(successCallback);
}

/** Function: requestMock
 * Mocks a request using the provided user.
 * Will also mock isAuthenticated which returns true if the user
 * is defined.
 *
 * Parameters:
 *   (Object) user - User object. Usually a <Resident> but can also
 *                   be e.g. null.
 *
 * Returns:
 *   (Object)
 */
function requestMock(data) {
	data = data || {};
	return {
		app: data.app
		, user: data.user
		, community: data.community
		, params: data.params
		, isAuthenticated: function() {
			return !_.isUndefined(data.user);
		}
		, param: function(key) {
			return data.params[key];
		}
	};
}

/** Function: appMock
 * Express.js App Mocking. Defines a `get` function which returns only
 * the db so far.
 *
 * Parameters:
 *   (Sequelize) db - Sequelize instance
 *
 * Returns:
 *   (Object)
 */
function appMock(db) {
	return {
		get: function(key) {
			if(key === 'db') {
				return db;
			}
		}
	};
}

function DataStore() {
	this.values = {};
}
DataStore.prototype.set = function set(key, value) {
	this.values[key] = value;
};
DataStore.prototype.get = function get(key) {
	return this.values[key];
};


module.exports = {
	req: requestMock
	, app: appMock
	, DataStore: DataStore
	, initDb: initDb
	, createResident: createResident
	, createCommunity: createCommunity
	, createTask: createTask
	, createAndAssignCommunity: createAndAssignCommunity
	, createAmountOfResidents: createAmountOfResidents
	, createAmountOfTasks: createAmountOfTasks
};