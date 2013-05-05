var _ = require('underscore')
	, Barefoot = require('barefoot')()
	, eventAggregator = require('./shared/eventAggregator')
	, Router = require('./shared/router')(eventAggregator)
	, dataStore = new Barefoot.DataStore()
	, barefootStartOptions = { dataStore: dataStore };

if(Barefoot.isRunningOnServer()) {
	// This is the only "on server" check which is necessary.
	var barefootFactory = require('./server/barefootFactory');
	_.extend(barefootStartOptions, barefootFactory);
}
Barefoot.start(Router, barefootStartOptions);



/*
module.exports = main;

if (module.parent === require.main) {
	cluster(function initializeCluster() {
		main();
	});
}
*/