"use strict";

/**
 * Module dependencies.
 */
var express = require('express')
	, http = require('http')
	, path = require('path')

	, sass = require('node-sass')

	, db = require('./lib/db')
	, livereload = require('express-livereload')
	, expressLayouts = require('express-ejs-layouts')

	, i18n = require('i18n')

	, app = express()

	, configFileName = '../config.' + app.settings.env
	, config = require(path.join(__dirname, configFileName));

/**
 * DB
 * FIXME: This is ugly :)
 */
var sequelize = db(config);
app.set('db', sequelize);

/**
 * Configure express
 */
app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.set('layout', 'layouts/default');
	app.configure('development', function() {
		app.use(express.logger('dev'));
	});

	/**
	 * i18n
	 */
	i18n.configure({
    	locales:['en', 'de']
    	, directory: 'src/locales'
    	, extension: '.js'
    	, debug: true
    });
	app.use(i18n.init);
	// binding template helpers to request (Credits to https://github.com/enyo #12)
	app.use(function(req, res, next) {
		res.locals.__ = res.__ = function() {
			return i18n.__.apply(req, arguments);
		};
		res.locals.__n = res.__n = function() {
			return i18n.__n.apply(req, arguments);
		};
		// do not forget this, otherwise your app will hang
		next();
	});

	app.use(expressLayouts);

	app.use(express.favicon(path.join(__dirname, 'public', 'images', 'favicon.ico'), {
		// 30 days
		maxAge: 2592000000
	}));

	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.cookieParser());
	app.use(express.session({ secret: config.sessionSecret }));

	app.use(require('./services/passport')(config, sequelize));

	app.use(sass.middleware({
		src: path.join(__dirname, 'public', 'stylesheets', 'sass')
		, dest: path.join(__dirname, 'public', 'stylesheets')
		, debug: true
	}));
	app.use(express.static(path.join(__dirname, 'public')));

	app.use(app.router);
});


app.configure('development', function(){
	app.use(express.errorHandler());
});

// livereload
livereload(app, config={});

// TODO: outsource to own file (or maybe even dynamic);
require('./controllers/home')(app);
require('./controllers/community')(app);

http.createServer(app).listen(app.get('port'), function(){
	app.configure('development', function() {
		console.log("Express server listening on port " + app.get('port'));
	});
});


exports.app = app;