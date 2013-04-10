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
			dialect: 'sqlite'
			, storage: './roomies_test.db'
			, logging: false
		}
	}

	, facebook: {
		clientID: 496325690405368
		, clientSecret: "DO NOT CHANGE ME TO THE REAL ONE"
		, callbackUrl: '/auth/facebook/callback'
		, channelUrl: '/fbchannel'
		, checkStatus: true
		, useCookies: true
		, parseXfbml: false
	}

	, logging: {
		errorLogLevel: "info"
		, requestLogLevel: "info"
		, disableErrorLog: false
		, disableRequestLog: true
	}

	, http: {
		port: 3000
	}

	, sessionSecret: "mega_ultra$ecret-imfall_dev"
}