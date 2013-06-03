
module.exports = {
	db: {
		database: 'roomies_test'
		, options: {
			dialect: 'sqlite'
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
		, hostname: '0.0.0.0'
		, displayedHostname: 'localhost'
		, protocol: 'http'
	}

	, sessionSecret: "mega_ultra$ecret-imfall_dev"
}
