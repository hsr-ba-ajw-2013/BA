"use strict";

module.exports = {
	db: {
		database: 'roomies'
		, username: 'roomies'
		, password: '12345'
		, options: {
			host: 'localhost'
			, port: 5432
			, dialect: 'postgres'
		}
	}

	, facebook: {
		clientID: 1245567890
		, clientSecret: "EXAMPLE"
	}

	, sessionSecret: "CHANGEME"
}