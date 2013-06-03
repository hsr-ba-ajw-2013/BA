#!/bin/zsh
#
# Configuration & Setup for Roomies
#

echo "Welcome to the installation of Roomies."
echo

install() {
	ask_questions

	echo "Checking out $GIT_TAG..."
	git checkout $GIT_TAG
	echo "...done"

	echo "Running setup..."
	make setup
	echo "...done"

	echo "Writing configuration..."
	write_configuration
	echo "...done"

	echo -n "Creating postgres DB or running migration..."
	db
	echo "done"

	echo -n "Updating zshrc..."
	update_zshrc
	echo "done"

	echo "Finished. Please run 'npm start' now."
	echo
}

ask_questions() {
	echo "Available git tags:"
	echo "---------------------"
	git tag -l
	echo "---------------------"

	read -p "Which tag shall be checked out? " GIT_TAG

	read -p "Roomies Facebook App Secret? " FB_APP_SECRET
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
		protocol: 'http'
		, port: 3000
		, hostname: '0.0.0.0'
		, displayedHostname: 'localhost'
		, displayedPort: 9001
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


	, sessionSecret: "$SESSION_SECRET"
}
ENDCONF
) > config.development.js
	cat config.development.js > config.production.js
}

db() {
	psql -h localhost -U postgres -c "CREATE ROLE roomies WITH PASSWORD '12345' LOGIN" >/dev/null 2>&1
	psql -h localhost -U postgres -c "CREATE DATABASE roomies WITH OWNER roomies" >/dev/null 2>&1

	mkdir config/

	(
		cat <<ENDCONF
{
	"development": {
		"username": "roomies"
		, "password": "12345"
		, "database": "roomies"
		, "host": "localhost"
		, "dialect": "postgres"
		, "port": 5432
	}
	, "test": {
		"username": "roomies"
		, "password": "12345"
		, "database": "roomies_test"
		, "host": "localhost"
		, "dialect": "postgres"
		, "port": 5432
	}
	, "production": {
		"username": "roomies"
		, "password": "12345"
		, "database": "roomies"
		, "host": "localhost"
		, "dialect": "postgres"
		, "port": 5432
	}
}
ENDCONF
) > config/config.json

	# figure out if table already exists and we need to do a migration
	echo -n "Checking if Communities Table already exists..."
	TABLE_EXISTS=`psql -U postgres -t -h localhost -d roomies -c "SELECT true FROM pg_tables WHERE tablename = 'Communities'";`
	TABLE_EXISTS=`echo $TABLE_EXISTS | tr -d ' '`
	if [ "$TABLE_EXISTS" == "t" ]; then
		echo "yes."
		echo -n "Running migrations..."
		./node_modules/.bin/sequelize -m >/dev/null 2>&1
		echo "done."
	fi

	echo -n "Cleaning created files..."
	rm config/config.json
	rmdir config
	echo "done"
}

update_zshrc() {
	if ! grep -Fxq "DISABLE_AUTO_UPDATE=true" ~/.zshrc
	then
		echo 'DISABLE_AUTO_UPDATE=true' >> ~/.zshrc
	fi
	if ! grep -Fxq 'export NODE_ENV="production"' ~/.zshrc
	then
		echo 'export NODE_ENV="production"' >> ~/.zshrc
	fi

	source ~/.zshrc
}

install
