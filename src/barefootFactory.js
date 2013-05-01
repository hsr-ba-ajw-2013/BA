var path = require('path')
	, fs = require('fs')
	, express = require('express')
	, _ = require('underscore')
	, app = express()
	, configFileName = '../config.' + app.settings.env
	, config = require(configFileName)

	, roomiesLocales = require('./shared/locales')
	, locale = require('locale')(roomiesLocales.supported)

	, mainJavaScriptFile = {
		route: '/javascripts/app.js'
		, file: path.join(process.cwd(), 'src', 'app.js')
		, exclude: [path.join(process.cwd(), 'src', 'barefootFactory.js')].concat(getServerOnlyFiles())
	};



/** START DEBUG **/
function getServerOnlyFiles() {
	var _ = require('underscore');
	var files = fs.readdirSync(path.join(process.cwd(), 'node_modules', 'barefoot', 'lib', 'server'));

	_.each(files, function(file, i) {
		files[i] = path.join(process.cwd(), 'node_modules', 'barefoot', 'lib', 'server', file);
	});

	return files;
}
/** END DEBUG **/

// Keep a reference of the src directory:
config.srcDir = path.join(process.cwd, 'src');

// Setup basic Express.JS app:


/** PrivateFunction: loadLayoutTemplate
 * Loads the "layout.html" file from the src directory and returns the file
 * contents.
 *
 * Returns:
 *     (String) the html template
 */
function loadLayoutTemplate() {
	var layoutFile = path.join(process.cwd(), 'src', 'layout.html')
		, encoding = 'utf8'
		, layoutTemplate = fs.readFileSync(layoutFile, encoding);

	return layoutTemplate;
}

function setupMiddlewares(app) {
	console.log('Setting up Express.JS Middleware');
	app.use(locale);

	app.use(express.bodyParser());
	app.use(express.static(path.join(process.cwd(),'src','public')));

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
	
	/*
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

/*
var apiRoutes = {
	get: {
		'/contacts': function(query) {
			console.log('bäm, here are your contacts', query);
			return contacts;
		}
	}
	, post: {
		'/contacts': function(contact, query) {
			console.log('yay, save a contact', contact, query);
		}
		, '/notfound': function() {
			throw new errors.NotFoundError('yay, errors are working :)');
		}
	}
	, put: {
		'/contacts': function(contact, query) {
			console.log('yay, update a contact', contact, query);
			contacts.push(contact);
			console.log(contacts);
		}
	}
	, del: {
		'/contacts/:id/:name': function(id, name, query) {
			console.log(':( delete a contact', id, name, query);
		}
	}
};*/

module.exports = {
	app: app
	, setupMiddlewares: setupMiddlewares
	, startExpressApp: startExpressApp
	, layoutTemplate: loadLayoutTemplate()
	//, apiRoutes: apiRoutes
	, mainJavaScriptFile: mainJavaScriptFile
};