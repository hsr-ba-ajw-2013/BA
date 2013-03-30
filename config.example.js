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
	}

	, logging: {
		errorLogLevel: "info"
		, requestLogLevel: "info"
		, disableErrorLog: false
		, disableRequestLog: true
	}

	, livereload: {
		exts: [
			"html", "css", "scss", "js", "hbs"
			, "png", "gif", "jpg"
		]
	}


	, sessionSecret: "CHANGEME"
}