#
# Makefile for roomies-prototype
#

REPORTER = spec
COVERAGE_REPORTER = html-cov
TEST_CMD = NODE_ENV=test ./node_modules/.bin/mocha --require test/runner.js --globals config
COVERAGE_CMD = NODE_ENV=test ./node_modules/.bin/jscover src test-cov
TEST_LIVE_CMD = $(TEST_CMD) --growl --watch

SCSS_PATH = src/shared/sass/app.scss
CSS_PATH = src/public/stylesheets/app.css


test: test-unit test-integration

test-live: test-unit-live test-integration-live

test-unit:
	@echo "Running Unit Tests:"
	@$(TEST_CMD) --reporter $(REPORTER) src/lib/*/test.js

test-integration:
	@echo "Running Integration Tests:"
	@$(TEST_CMD) --reporter $(REPORTER) test/*-test.js

test-unit-live:
	@$(TEST_LIVE_CMD) --reporter $(REPORTER) src/lib/*/test.js

test-integration-live:

	@$(TEST_LIVE_CMD) --reporter $(REPORTER) test/*-test.js

test-coverage: test
	@echo "Building Test Coverage Reports:"
	@$(COVERAGE_CMD)
	@COVERAGE=1 $(TEST_CMD) --reporter $(COVERAGE_REPORTER) src/lib/*/test.js  > unit-coverage.html
	@COVERAGE=1 $(TEST_CMD) --reporter $(COVERAGE_REPORTER) test/*-test.js > integration-coverage.html

setup:
	@echo "Removing dependencies"
	@rm -Rf ./node_modules
	@echo "Cleaning npm cache"
	@npm cache clean
	@echo "Installing dependencies"
	@npm install
	@echo "Copying configs"
	-cp -v config.development.js config.development.old.js
	@cp -v config.example.js config.development.js
	@echo "Precompiling SASS Stylesheets"
	@make precompile-sass
	@echo "Done. You should now be able to start using `npm start`."

start:
	@npm start

clean:
	@rm -Rf ./node_modules
	@rm -Rf ./test-cov
	@rm unit-coverage.html
	@rm integration-coverage.html
	@rm npm-debug.log

precompile-sass:
	-rm $(CSS_PATH)
	@sass $(SCSS_PATH) $(CSS_PATH)

precompile-sass-live:
	@nodemon -w src/views/sass -e scss -x "make precompile-sass -f" Makefile


.PHONY: test test-live test-unit test-integration test-unit-live test-integration-live test-coverage setup clean