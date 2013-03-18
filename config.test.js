"use strict";

module.exports = {
	db: {
		database: 'roomies_test'
		, options: {
			dialect: 'sqlite'
			, logging: false
		}
	}

	, facebook: {
		clientID: 1245567890
		, clientSecret: "EXAMPLE"
	}

	, sessionSecret: "CHANGEME"
}