"use strict";

module.exports = {
	db: {
		type: 'sqlite3'
		, options: {
			database: ':memory:'
		}
	}

	, facebook: {
		clientID: 1245567890
		, clientSecret: "EXAMPLE"
	}

	, sessionSecret: "CHANGEME"
}