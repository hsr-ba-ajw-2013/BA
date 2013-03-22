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


test: test-unit test-functional

test-unit:
	@echo "Running Unit Tests:"
	@$(TEST_CMD) --reporter $(REPORTER) src/lib/*/test.js

test-functional:
	@echo "Running Functional Tests:"
	@$(TEST_CMD) --reporter $(REPORTER) test/*-test.js

test-unit-live:
	@$(TEST_LIVE_CMD) --reporter $(REPORTER) src/lib/*/test.js

test-functional-live:
	@$(TEST_LIVE_CMD) --reporter $(REPORTER) test/*-test.js

test-coverage: test
	@echo "Building Test Coverage Reports:"
	@$(COVERAGE_CMD)
	@COVERAGE=1 $(TEST_CMD) --reporter $(COVERAGE_REPORTER) src/lib/*/test.js  > unit-coverage.html
	@COVERAGE=1 $(TEST_CMD) --reporter $(COVERAGE_REPORTER) test/*-test.js > functional-coverage.html

setup: clean
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

live:
	@nodemon index.js

clean:
	@echo "Removing dependencies"
	@rm -Rf ./node_modules
	@echo "Cleaning npm cache"
	@npm cache clean
	@echo "Cleaning test-coverage"
	@rm -Rf ./test-cov
	@rm unit-coverage.html
	@rm functional-coverage.html
	@echo "Cleaning npm debug log"
	@rm npm-debug.log

precompile-sass:
	-rm $(CSS_PATH)
	@sass $(SCSS_PATH) $(CSS_PATH)

precompile-sass-live:
	@nodemon -w src/shared/sass -e scss -x "make precompile-sass -f" Makefile


.PHONY: test test-unit test-functional test-unit-live test-functional-live test-coverage setup clean precompile-sass-live
