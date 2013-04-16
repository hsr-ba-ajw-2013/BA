#
# Makefile for roomies-prototype
#

SHELL = bash

REPORTER = spec
COVERAGE_REPORTER = html-cov
COVERALLS_REPORTER = mocha-lcov-reporter
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

coverage:
	@echo -n "Running jscover..."
	@$(COVERAGE_CMD)
	@echo "done"

test-coverage: test coverage
	@echo "Building Test Coverage Reports:"
	@echo -n "Creating unit coverage report..."
	@COVERAGE=1 $(TEST_CMD) --reporter $(COVERAGE_REPORTER) src/lib/*/test.js  > unit-coverage.html
	@echo "done"
	@echo -n "Creating functional coverage report..."
	@COVERAGE=1 $(TEST_CMD) --reporter $(COVERAGE_REPORTER) test/*-test.js > functional-coverage.html
	@echo "done"

test-coveralls: test coverage
	@echo "Sending coverage to coveralls.io:"
	@COVERAGE=1 $(TEST_CMD) --reporter $(COVERALLS_REPORTER) test-cov | ./node_modules/coveralls/bin/coveralls.js

setup: clean deps config precompile-sass
	@echo "Done. You should now be able to start using 'npm start'."

deps:
	@echo "Installing dependencies"
	@npm install

config:
	@echo "Copying configs"
	@-cp -v config.development.js config.development.old.js
	@cp -v config.example.js config.development.js

start:
	@npm start

live:
	@nodemon index.js

clean:
	@echo "Removing dependencies"
	@-rm -Rf ./node_modules
	@echo "Cleaning npm cache"
	@npm cache clean
	@echo "Cleaning test-coverage"
	@-rm -Rf ./test-cov
	@-rm unit-coverage.html
	@-rm functional-coverage.html
	@echo "Cleaning npm debug log"
	@-rm npm-debug.log
	@echo "Cleaning docs"
	@-rm -fr ./docs
	@echo "Cleaning compiled CSS"
	@-rm $(CSS_PATH)

precompile-sass:
	@echo "Precompiling SASS Stylesheets"
	@-rm $(CSS_PATH)
	@-sass --trace -t compressed --load-path src/shared/sass/vendor --load-path src/shared/sass/vendor/foundation --load-path src/shared/sass/vendor/bourbon $(SCSS_PATH) $(CSS_PATH)

precompile-sass-live:
	@nodemon -w src/shared/sass -e scss -x "make precompile-sass -f" Makefile

lint:
	@node_modules/.bin/jshint index.js src/

docs:
	-mkdir ./docs
	@NaturalDocs -i ./src -o HTML ./docs -p ./.naturaldocs -xi ./src/public/javascripts/lib/ -s Default style

.PHONY: test test-unit test-functional test-unit-live test-functional-live test-coverage setup clean precompile-sass-live lint deps config docs
