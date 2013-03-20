"use strict";

module.exports = {
	db: {
		database: 'roomies_test'
		, options: {
			dialect: 'sqlite'
			, logging: false
		}
	}

	/*, auth: {
		strategy: './dummy-strategy'
	}*/

	, facebook: {
		clientID: 1245567890
		, clientSecret: "EXAMPLE"
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

	, sessionSecret: "CHANGEME"
}