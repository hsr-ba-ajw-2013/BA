var Barefoot = require('barefoot')()
	, EventAggregator = require('./shared/eventAggregator')
	, ResidentModel = require('./shared/models/resident')
	, Router = require('./shared/router')
	, barefootStartOptions = {};

/** Function: setupRequestContext
 * Called by barefoot to set up the context when processing a route on the
 * server or initialising the router on the client.
 *
 * This function works with the scope of the router!
 */
function setupRequestContext() {
	this.dataStore.registerModel('ResidentModel', ResidentModel);
	this.eventAggregator = new EventAggregator();
}


barefootStartOptions.setupRequestContext = setupRequestContext;
if(Barefoot.isRunningOnServer()) {
	// This is the only "on server" check which is necessary.
	var barefootFactory = require('./server/barefootFactory')
		, cluster = require('./server/cluster');
	barefootStartOptions = barefootFactory(barefootStartOptions);
	if(module.parent === require.main) {
		cluster(function initializeCluster() {
			Barefoot.start(Router, barefootStartOptions);
		});
	}
} else {
	Barefoot.start(Router, barefootStartOptions);
}


/*
module.exports = main;

if (module.parent === require.main) {
	cluster(function initializeCluster() {
		main();
	});
}
*/