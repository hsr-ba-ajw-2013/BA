var _ = require('underscore')
	, Barefoot = require('barefoot')()
	//, dataStore = new Barefoot.DataStore()
	, barefootStartOptions = {};

var RoomiesRouter = Barefoot.Router.extend({
	routes: { }
});

if(Barefoot.isRunningOnServer()) {
	// This is the only "on server" check which is necessary.
	_.extend(barefootStartOptions, require('./barefootFactory'));
}
Barefoot.start(RoomiesRouter, barefootStartOptions);


/** File: Application
 * The Roomies application initializator.
 *
var express = require('express')
	, path = require('path')

	, http = require('http')

	, cluster = require('./lib/cluster')
	, middleware = require('./lib/middleware')

	, community = require('./lib/community')
	, home = require('./lib/home')
	, login = require('./lib/login')
	, resident = require('./lib/resident')
	, task = require('./lib/task')
	, rank = require('./lib/rank')
	, facebookChannel = require('./lib/facebook-channel');

/** Function: main
 * Sets up all necessary middlewares and starts the application.
 *
 * Returns:
 *     (Express) - An Express.JS application instance
 *
function main() {
	var app = express()
		, configFileName = '../config.' + app.settings.env
		, config = require(path.join(__dirname, configFileName));

	config.srcDir = __dirname;

	middleware(app, config);

	home(app, config);
	login(app, config);

	// FIXME: Ugly
	var communityRelationships = community(app, config)
		, residentRelationships = resident(app, config)
		, taskRelationships = task(app, config);

	rank(app, config);

	communityRelationships(app);
	residentRelationships(app);
	taskRelationships(app);
	//rankRelationships(app);

	facebookChannel(app, config);


	// sync db
	app.get('db').sync();

	http.createServer(app).listen(config.http.port, function listening(){
		app.configure('development', function developmentLog() {
			console.log("Express server listening on port " + config.http.port);
		});
	});


	return app;
}

module.exports = main;

if (module.parent === require.main) {
	cluster(function initializeCluster() {
		main();
	});
}
*/