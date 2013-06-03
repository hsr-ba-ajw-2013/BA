var Barefoot = require('node-barefoot')()
	, EventAggregator = require('./shared/eventAggregator')
	, ResidentModel = require('./shared/models/resident')
	, CommunityModel = require('./shared/models/community')
	, TasksCollection = require('./shared/collections/tasks')
	, TaskModel = require('./shared/models/task')
	, RankingsCollection = require('./shared/collections/rankings')
	, RankingModel = require('./shared/models/ranking')
	, FlashModel = require('./shared/models/flash')
	, ResidentProfileModel = require('./shared/models/residentprofile')
	, AppContextModel = require('./shared/models/appContext')
	, Router = require('./shared/router')
	, barefootStartOptions = {};

/** Function: setupRequestContext
 * Called by barefoot to set up the context when processing a route on the
 * server or initialising the router on the client.
 *
 * This function works with the scope of the router!
 */
function setupRequestContext() {
	this.dataStore.registerCollection(
		'TasksCollection', TasksCollection, TaskModel);
	this.dataStore.registerCollection(
		'RankingsCollection', RankingsCollection, RankingModel);

	this.dataStore.registerModel('ResidentModel', ResidentModel);
	this.dataStore.registerModel('CommunityModel', CommunityModel);
	this.dataStore.registerModel('TaskModel', TaskModel);
	this.dataStore.registerModel('ResidentProfileModel', ResidentProfileModel);
	this.dataStore.registerModel('AppContextModel', AppContextModel);
	this.dataStore.registerModel('FlashModel', FlashModel);

	this.eventAggregator = new EventAggregator();
}

/** Function: start
 * This function simply invokes the barefoot start function.
 */
var start = function start() {
	Barefoot.start(Router, barefootStartOptions);
};


barefootStartOptions.setupRequestContext = setupRequestContext;
if(Barefoot.isRunningOnServer()) {
	var barefootFactory = require('./server/barefootFactory')
		, cluster = require('./server/cluster');
	barefootStartOptions = barefootFactory(barefootStartOptions);

	// Check if the server should start in clustered mode:
	if(barefootStartOptions.config.enableClustering) {
		var singleClusterStart = start;
		start = function() {
			if(module.parent === require.main) {
				cluster(function initializeCluster() {
					singleClusterStart();
				});
			}
		};
	}
}


/* Start the engines gentlemen! */
start();