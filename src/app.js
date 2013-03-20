"use strict";

/**
 * Module dependencies.
 */
var express = require('express')
	, path = require('path')

	, http = require('http')

	, cluster = require('./lib/cluster')
	, middleware = require('./lib/middleware')

	, community = require('./lib/community')
	, home = require('./lib/home')
	, resident = require('./lib/resident')
	, task = require('./lib/task');



function main(config) {
	var app = express();

	config.srcDir = __dirname;

	middleware(app, config);

	home(app, config);

	// FIXME: Ugly
	var communityRelationships = community(app, config)
		, residentRelationships = resident(app, config)
		, taskRelationships = task(app, config);

	communityRelationships(app);
	residentRelationships(app);
	taskRelationships(app);

	// sync db
	app.get('db').sync();

	return app;
}

module.exports = main;

if (module.parent === require.main) {
	cluster(function() {
		var env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
			, configFileName = '../config.' + env
			, config = require(path.join(__dirname, configFileName));
		var app = main(config);

		http.createServer(app).listen(config.http.port, function(){
			console.log("Express server listening on port " + config.http.port);
		});
	});
}