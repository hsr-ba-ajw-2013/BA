var Barefoot = require('node-barefoot')()
	, EventAggregator = require('./shared/eventAggregator')
	, ResidentModel = require('./shared/models/resident')
	, CommunityModel = require('./shared/models/community')
	, TasksCollection = require('./shared/collections/tasks')
	, Router = require('./shared/router')
	, debug = require('debug')('roomies:app')
	, barefootStartOptions = {};

/** Function: setupRequestContext
 * Called by barefoot to set up the context when processing a route on the
 * server or initialising the router on the client.
 *
 * This function works with the scope of the router!
 */
function setupRequestContext() {
	debug('setup request context');
	this.dataStore.registerModel('ResidentModel', ResidentModel);
	this.dataStore.registerModel('CommunityModel', CommunityModel);
	this.dataStore.registerCollection('TasksCollection', TasksCollection);
	this.eventAggregator = new EventAggregator();
}

/** Function: start
 * This function simply invokes the barefoot start function.
 */
var start = function start() {
	debug('start barefoot');
	Barefoot.start(Router, barefootStartOptions);
};


barefootStartOptions.setupRequestContext = setupRequestContext;
if(Barefoot.isRunningOnServer()) {
	// This is the only "on server" check which is necessary.
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