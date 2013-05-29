/** Class: BarefootFactory
 * The <BarefootFactory> is used to setup the server side application. It will
 * only be loaded and used when the application is started on the node.js
 * server.
 */
var path = require('path')
	, fs = require('fs')
	, express = require('express')
	, _ = require('underscore')
	, app = express()
	, configFileName = path.join(process.cwd(), 'config.' + app.settings.env)
	, config = require(configFileName)
	, debug = require('debug')('roomies:barefoot-factory')
	, middleware = require('./middleware')
	, api = require('./api')
	, ResidentModel = require('../shared/models/resident')
	, CommunityModel = require('../shared/models/community')
	, AppContextModel = require('../shared/models/appcontext')
	, FlashModel = require('../shared/models/flash')
	, domain = require('domain')
	, serverDomain = domain.create();

// Keep a reference of the src directory:
config.srcDir = path.join(process.cwd(), 'src');

serverDomain.on('error', function(err) {
	// Warning: According to http://nodejs.org/api/domain.html this is
	// a very bad idea because it won't resurrect. Might be better
	// to do in the cluster module & automatically restart the crashed
	// worker.
	// for now this is okay as Roomies is not a NASA Software.
	console.log(err);
	console.log(err.stack);
});


/** PrivateFunction: getDirectoryFiles
 * Returns an array with the paths of all files contained in the given path.
 * This function traverses the directory tree down recursivly.
 *
 * Parameters:
 *     (String) directoryPath - The directory to list
 *     (Array) extensionFilter - An array with file extension you'd like to
 *                               returns. Example: ['.js']
 * Returns:
 *     (Array) with absolute file paths
 */
function getDirectoryFiles(directoryPath, extensionFilter) {
	extensionFilter = extensionFilter || [];

	var files
		, crawler = function crawler(subdirectory, fileBuffer) {
			if(_.isUndefined(fileBuffer)) { fileBuffer = []; }

			var content = fs.readdirSync(subdirectory);

			_.each(content, function(file) {
				var filePath = path.join(subdirectory, file)
					, extension = path.extname(file);

				if(fs.statSync(filePath).isFile()) {
					if(extensionFilter.length === 0 ||
						extensionFilter.indexOf(extension) !== -1) {
						fileBuffer.push(filePath);
					}
				} else {
					crawler(filePath, fileBuffer);
				}
			});

			return fileBuffer;
		};

	files = crawler(directoryPath);
	return files;
}

/** PrivateFunction: loadLayoutTemplate
 * Loads the "layout.html" file from the src directory and returns the file
 * contents.
 *
 * Returns:
 *     (String) the html template
 */
function loadLayoutTemplate() {
	var layoutFile = path.join(process.cwd(), 'src', 'server', 'layout.html')
		, encoding = 'utf8'
		, layoutTemplate = fs.readFileSync(layoutFile, encoding);

	return layoutTemplate;
}

/** PrivateFunction: clientsideJavaScriptFile
 * Returns an object with information, where and how barefoot should server the
 * client side javascript code.
 */
function clientsideJavaScriptFile() {
	var serverOnlyFiles = path.join(process.cwd(), 'src', 'server')
		, settings = {
			url: '/javascripts/app.js'
			, mainFile: path.join(process.cwd(), 'src', 'app.js')
			, exclude: getDirectoryFiles(serverOnlyFiles, ['.js'])
		};

	if(_.has(config, 'clientsideJavaScriptOptimizations')) {
		_.extend(settings, config.clientsideJavaScriptOptimizations);
	}

	return settings;
}

/** Function: setupMiddlewares(app)
 * This function is called by barefoot. It sets up all application specific
 * middlewares for the given Express.JS app.
 *
 * Parameters:
 *     (Object) app - An Express.JS app
 */
function setupMiddlewares(app) {
	debug('Setting up Express.JS Middleware');
	middleware(app, config);

	/*
	facebookChannel(app, config);
	*/
}

/** Function: setupApiAdapter
 * Injected into barefoot to trigger the setup of all API functionalities.
 *
 * Parameters:
 *     (APIAdapter) apiAdapter - The Barefoot APIAdapter which wants to get its
 *                               configuration.
 */
function setupApiAdapter(apiAdapter) {
	debug('setup api adapter');
	api(apiAdapter);
}

/** Function: startExpressApp
 * This callback is used by barefoot to start the server application.
 */
function startExpressApp(app) {
	serverDomain.run(function() {
		var cb = function() {
			app.configure('development', function developmentLog() {
				debug('Express server listening on port ' + config.http.port);
			});
		};
		if(config.http.protocol === 'https') {
			debug('Running on https');
			require('https').createServer(app).listen(config.http.port
				, config.http.hostname, cb);
		} else {
			debug('Running on plain old http');
			require('http').createServer(app).listen(config.http.port
				, config.http.hostname, cb);
		}
	});

	return app;
}

/** Function: setupServerRequestContext
 * Enhances the setupRequestContext function of the app.js file by adding some
 * server specific functionality to it.
 *
 * To ensure its execution, it will be monkey-patched on export.
 *
 * This function works inside the scope of the router! So you have access to all
 * of its properties.
 *
 * For the moment, it reads the user property from the req property of the
 * router and creates a ResidentModel with it. That model is placed in the
 * ApplicationModel which is accessible via the <Barefoot.DataStore at
 * http://swissmanu.github.io/barefoot/docs/files/lib/datastore-js.html>
 */
function setupServerRequestContext() {
	debug('setup server request context');
	// We should probably have a user property in the req object since the
	// auth middleware injects it there. Lets do some fun stuff with it and
	// create a ResidentModel out of it.
	var authenticatedUser = this.req.user
		, authenticatedUsersCommunity = this.req.community
		, userModel
		, communityModel;

	if(!_.isUndefined(authenticatedUser)) {
		userModel = new ResidentModel(authenticatedUser.selectedValues);
		this.dataStore.set('currentUser', userModel);
	}

	if(!_.isUndefined(authenticatedUsersCommunity)) {
		communityModel = new CommunityModel(
			authenticatedUsersCommunity.selectedValues);
		this.dataStore.set('community', communityModel);
	}

	var appContext = new AppContextModel({
		config: this.app.locals.config
	});
	this.dataStore.set('AppContextModel', appContext);

	this.dataStore.set('FlashModel', new FlashModel());
}


/** exporter
 * Monkey-patches the startOptions.setupRequestContext function by wrapping it
 * into the setupCombinedRequestContext function. This wrapper will ensure that
 * when setupRequestContext is executed on the server, setupServerRequestContext
 * is executed too.
 *
 * Parameters:
 *     (Object) startOptions - Barefoot startup options
 *
 * Returns:
 *     (Object) containing server specific barefoot startup options
 */
function exporter(startOptions) {
	var setupSharedRequestContext = startOptions.setupRequestContext
		, setupCombinedRequestContext = function setupCombinedRequestContext() {
			var routerScope = this;
			setupSharedRequestContext.call(routerScope);
			setupServerRequestContext.call(routerScope);
		};

	startOptions.setupRequestContext = setupCombinedRequestContext;
	_.extend(startOptions, {
		app: app
		, setupMiddlewares: setupMiddlewares
		, setupApiAdapter: setupApiAdapter
		, mainJavaScriptFile: clientsideJavaScriptFile()
		, layoutTemplate: loadLayoutTemplate()
		, config: config
		, startExpressApp: startExpressApp
	});

	return startOptions;
}

module.exports = exporter;