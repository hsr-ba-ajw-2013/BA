"use strict";

module.exports = {
	/* Database: */
	// Choose one of the templates regarding your preferred database.
	// SQLite will run in-memory, for postgres please specify the connection
	// parameters in the "options" object.
	db: {
		/* SQLite template: */
		database: 'roomies_test'
		, options: {
			dialect: 'sqlite',
			logging: false
		}

		/* PostrgreSQL template: */
		/*
		database: 'roomies'
		, username: 'roomies'
		, password: '12345'
		, options: {
			host: 'localhost'
			, port: 5432
			, dialect: 'postgres'
			, logging: false
		}
		*/
	}

	/* Facebook Application Settings: */
	// Users need to have a facebook account in order to register and login to
	// roomies.
	// Create a facebook application (https://developers.facebook.com/) and fill
	// in clientID and clientSecret.
	, facebook: {
		clientID: 496325690405368
		, clientSecret: "EXAMPLE"
		, callbackUrl: '/auth/facebook/callback'
		, channelUrl: '/fbchannel'
		, checkStatus: true
		, useCookies: true
		, parseXfbml: false
	}

	/* HTTP Server Settings: */
	// Roomies will use these settings to set up its express.js HTTP server.
	// Choose https as protocol if you like it more secure (but do not ask us
	// how to configure certificates ;) )
	, http: {
		port: 3000
		, hostname: '0.0.0.0'
		// in case you listen on 0.0.0.0, you'd like to use a different
		// hostname to be displayed for absolute urls.
		, displayedHostname: 'localhost'
		// the same here for the port, e.g. when you use NAT.
		, displayedPort: 9001
		, protocol: 'http'
	}

	/* HTTP Timout: */
	// Specify after how many milliseconds a request gets canceled.
	, connectTimeout: {
		time: 16000
	}

	/* SessionSecret: */
	// Generate a random session secret to secure your session data transfered
	// between the client and server.
	, sessionSecret: "CHANGEME"

	/* Clustering: */
	// Roomies supports the execition on mutliple CPU cores. If you like, enable
	// this feature here.
	, enableClustering: true

	/* Logging: */
	// Turn logging on or off.
	// For a more detailed runtime log, you can start roomies with debug
	// messages turned on:
	//
	// > DEBUG=roomies* npm start
	//
	// More information about how the debug trace works is available here:
	// https://github.com/visionmedia/debug
	, logging: {
		errorLogLevel: "info"
		, requestLogLevel: "info"
		, disableErrorLog: false
		, disableRequestLog: true
	}

	/* Browserify: */
	// Roomies uses browserify to package all neceessary CommonJS modules into
	// one big JavaScript file when delivering them to the client.
	// Use these settings to customize how that app.js file is created.
	//
	// More information about these settings is available here:
	// https://github.com/ForbesLindesay/browserify-middleware
	, clientsideJavaScriptOptimizations: {
		debug: false
		, gzip: true
		, minify: true
	}

	/* Live Reload: */
	// If you do development work, use "make live" to start roomies with live
	// reloading activated. This way, your browser will refresh itself
	// automatically when you change files of roomies code base.
	, livereload: {
		exts: [
			"html", "css", "scss", "js", "hbs"
			, "png", "gif", "jpg"
		]
	}
}