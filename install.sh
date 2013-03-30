#!/bin/bash
#
# Configuration & Setup for Roomies
#

echo "Welcome to the installation of Roomies."
echo

install() {
	ask_questions

	echo "Checking out $GIT_TAG..."
	git checkout $GIT_TAG
	echo "..done"

	echo "Running setup..."
	make setup
	echo "..done"

	echo "Writing configuration..."
	write_configuration
	echo "..done"

	echo "Creating postgres DB..."
	postgres_db
	echo "...done"

	echo "Done. Please run 'npm start' now."
	echo
}

ask_questions() {
	echo "Verfügbare git tags:"
	echo "---------------------"
	git tag -l
	echo "---------------------"

	read -p "Welcher Tag soll ausgecheckt werden? " GIT_TAG

	read -p "Wie lautet der Facebook App Secret? " FB_APP_SECRET
}

write_configuration() {
	SESSION_SECRET=`openssl rand -base64 32`

	(
		cat <<ENDCONF
module.exports = {
	db: {
		database: 'roomies'
		, username: 'roomies'
		, password: '12345'
		, options: {
			host: 'localhost'
			, port: 5432
			, dialect: 'postgres'
			, logging: false
		}
	}

	, facebook: {
		clientID: 496325690405368
		, clientSecret: "$FB_APP_SECRET"
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


	, sessionSecret: "$SESSION_SECRET"
}
ENDCONF
) > config.development.js
}

postgres_db() {
	psql -h localhost -U postgres -c "CREATE ROLE roomies WITH PASSWORD '12345' LOGIN"
	psql -h localhost -U postgres -c "CREATE DATABASE roomies WITH OWNER roomies"
}

install
