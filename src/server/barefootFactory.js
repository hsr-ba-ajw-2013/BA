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

	, middleware = require('./middleware')
	, api = require('./api')
	, ResidentModel = require('../shared/models/resident');

// Keep a reference of the src directory:
config.srcDir = path.join(process.cwd(), 'src');


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

/** PrivateFunction: clientJavaScriptFile
 * Returns an object with information, where and how barefoot should server the
 * client side javascript code.
 */
function clientJavaScriptFile() {
	var serverOnlySource = path.join(process.cwd(), 'src', 'server');

	return {
		route: '/javascripts/app.js'
		, file: path.join(process.cwd(), 'src', 'app.js')
		, exclude: getDirectoryFiles(serverOnlySource, ['.js'])
	};
}

/** Function: setupMiddlewares(app)
 * This function is called by barefoot. It sets up all application specific
 * middlewares for the given Express.JS app.
 *
 * Parameters:
 *     (Object) app - An Express.JS app
 */
function setupMiddlewares(app) {
	console.log('Setting up Express.JS Middleware');
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
	api(apiAdapter);
}

/** Function: startExpressApp
 * This callback is used by barefoot to start the server application.
 */
function startExpressApp(app) {
	app.listen(config.http.port, function listening(){
		app.configure('development', function developmentLog() {
			console.log("Express server listening on port " + config.http.port);
		});
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
	// We should probably have a user property in the req object since the
	// auth middleware injects it there. Lets do some fun stuff with it and
	// create a ResidentModel out of it.
	var authenticatedUser = this.req.user
		, authenticatedResident = new ResidentModel(authenticatedUser.selectedValues);

	this.dataStore.get('applicationModel').set('user', authenticatedResident);
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
		, mainJavaScriptFile: clientJavaScriptFile()
		, layoutTemplate: loadLayoutTemplate()
		, startExpressApp: startExpressApp
	});

	return startOptions;
}

module.exports = exporter;