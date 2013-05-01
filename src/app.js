var _ = require('underscore')
	, Barefoot = require('barefoot')()
	, Router = require('./router')
	, dataStore = new Barefoot.DataStore()
	, barefootStartOptions = { dataStore: dataStore };

if(Barefoot.isRunningOnServer()) {
	// This is the only "on server" check which is necessary.
	var barefootFactory = require('./barefootFactory');
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