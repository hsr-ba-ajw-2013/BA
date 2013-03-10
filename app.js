"use strict";

/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')

	, sass = require('node-sass')

	, config = require(path.join(__dirname, 'config'))

	, db = require('./models/db')
	, livereload = require('express-livereload');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser(config.cookieSecret));
	app.use(express.session());
	app.use(app.router);
	app.use(sass.middleware({
		src: path.join(__dirname, 'public', 'stylesheets', 'sass')
		, dest: path.join(__dirname, 'public', 'stylesheets')
		, debug: true
	}));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

db(app, config);

app.get('/', routes.index);
//app.get('/users', user.list);


// livereload
livereload(app, config={})

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});


exports.app = app;