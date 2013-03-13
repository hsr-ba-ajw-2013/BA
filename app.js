"use strict";

/**
 * Module dependencies.
 */
var express = require('express')
	, http = require('http')
	, path = require('path')

	, controllers = require('./lib/controllers')

	, sass = require('node-sass')

	, db = require('./models/db')
	, livereload = require('express-livereload')


	, app = express()

	, configFileName = 'config' +
		app.settings.env === 'test' ? '_test' : ''
	, config = require(path.join(__dirname, configFileName))

/**
 * DB
 * FIXME: This is ugly :)
 */
var schema = db(config);
app.set('dbschema', schema);

/**
 * Configure express
 */
app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon(path.join(__dirname, 'public', 'images', 'favicon.ico'), {
		// 30 days
		maxAge: 2592000000
	}));
	app.use(express.logger('dev'));

	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.cookieParser());
	app.use(express.session({ secret: config.sessionSecret }));

	app.use(require('./services/passport')(config, schema));

	app.use(sass.middleware({
		src: path.join(__dirname, 'public', 'stylesheets', 'sass')
		, dest: path.join(__dirname, 'public', 'stylesheets')
		, debug: true
	}));
	app.use(express.static(path.join(__dirname, 'public')));

	app.use(app.router);
});

app.use(require('./services/api')(schema));


app.configure('development', function(){
	app.use(express.errorHandler());

	schema.autoupdate(function() {
		console.log('Schema autoupdate done');
	});
});

app.configure('test', function() {
	schema.automigrate(function() {
		console.log('Schema automigrate done');
	});
})


controllers(app, {verbose: !module.parent});


// livereload
livereload(app, config={})

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});


exports.app = app;