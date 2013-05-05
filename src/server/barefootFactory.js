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

	, templateLocales = require('../shared/locales')
	, locale = require('locale')(templateLocales.supported)

	, middleware = require('./middleware')
	, api = require('./api');

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
	app.use(locale);

	//app.use(express.bodyParser());
	//app.use(express.static(y));

	app.use(function(req, res, next) {
		if(_.isUndefined(req.cookies)) {
			req.cookies = { locale: req.locale };
		} else {
			if(_.has(req.cookies, 'locale')) {
				req.cookies = { locale: req.locale };
			} else {
				req.cookies = _.extend(req.cookies, { locale: req.locale });
			}
		}

		next();
	});

	app.use(function(req, res, next) {
		res.cookie('locale', req.locale);
		next();
	});

	middleware(app, config);



	/*
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
	*/

	// sync db
	//app.get('db').sync();
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

module.exports = {
	app: app
	, setupMiddlewares: setupMiddlewares
	, startExpressApp: startExpressApp
	, layoutTemplate: loadLayoutTemplate()
	, apiRoutes: api.routes
	, mainJavaScriptFile: clientJavaScriptFile()
};