"use strict";

module.exports = {
	/*db: {
		database: 'roomies'
		, username: 'roomies'
		, password: '12345'
		, options: {
			host: 'localhost'
			, port: 5432
			, dialect: 'postgres'
			, logging: false
		}
	}*/
	db: {
		database: 'roomies_test'
		, options: {
			dialect: 'sqlite',
			logging: false
		}
	}

	, facebook: {
		clientID: 496325690405368
		, clientSecret: "EXAMPLE"
		, callbackUrl: '/auth/facebook/callback'
		, channelUrl: '/fbchannel'
		, checkStatus: true
		, useCookies: true
		, parseXfbml: false
	}

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

	, connectTimeout: {
		time: 16000
	}

	, enableClustering: true

	, logging: {
		errorLogLevel: "info"
		, requestLogLevel: "info"
		, disableErrorLog: false
		, disableRequestLog: true
	}

	, clientsideJavaScriptOptimizations: {
		debug: false
		, gzip: true
		, minify: true
	}

	, livereload: {
		exts: [
			"html", "css", "scss", "js", "hbs"
			, "png", "gif", "jpg"
		]
	}

	, sessionSecret: "CHANGEME"
}