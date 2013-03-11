"use strict";

/**
 * Module dependencies.
 */
var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')

	, controllers = require('./lib/controllers')

	, passport = require('passport')
	, FacebookStrategy = require('passport-facebook').Strategy

	, sass = require('node-sass')

	, config = require(path.join(__dirname, 'config'))

	, db = require('./models/db')
	, livereload = require('express-livereload');


var app = express();

/**
 * Configure express
 */
app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser(config.cookieSecret));
	app.use(express.session({ secret: config.sessionSecret }));

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(sass.middleware({
		src: path.join(__dirname, 'public', 'stylesheets', 'sass')
		, dest: path.join(__dirname, 'public', 'stylesheets')
		, debug: true
	}));
	app.use(express.static(path.join(__dirname, 'public')));

	app.use(app.router);
});

/**
 * DB
 * FIXME: This is ugly :)
 */
var schema = db(app, config);


app.configure('development', function(){
	app.use(express.errorHandler());

	schema.autoupdate(function() {
		console.log('Schema autoupdate done');
	});
});


controllers(app, {verbose: !module.parent});

app.get('/', routes.index);
app.get('/login', routes.index);
//app.get('/users', user.list);


passport.use(new FacebookStrategy({
		clientID: config.facebook.clientID
		, clientSecret: config.facebook.clientSecret
		, callbackURL: config.facebook.callbackURL
	},
	function findOrCreateUser(accessToken, refreshToken, profile, done) {
		var User = schema.models.User;
		User.findOne({where: {facebookId: profile.id, active: true}}, function(err, user) {
			if(err !== null) {
				return done(err);
			}
			if(user === null) {
				var user = new User({
					facebookId: profile.id,
					name: profile.displayName
				});
				user.save(function(err, foobar) {
					if (err !== null) {
						return done(err);
					}
					done(null, user);
				});
			} else {
				return done(null, user);
			}
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	var User = schema.models.User;
	User.find(id, function(err, user) {
		done(err, user);
	});
});


app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/'
	, failureRedirect: '/login'
	, failureFlash: true
}));


// livereload
livereload(app, config={})

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});


exports.app = app;