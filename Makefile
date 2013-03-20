#
# Makefile for roomies-prototype
#

REPORTER = spec
COVERAGE_REPORTER = html-cov
TEST_CMD = NODE_ENV=test ./node_modules/.bin/mocha --require test/runner.js --globals config
COVERAGE_CMD = NODE_ENV=test ./node_modules/.bin/jscover src test-cov
TEST_LIVE_CMD = $(TEST_CMD) --growl --watch

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
	@rm -Rf ./node_modules
	@npm cache clean
	@npm install

start:
	@npm start

clean:
	@rm -Rf ./node_modules
	@rm -Rf ./test-cov
	@rm unit-coverage.html
	@rm integration-coverage.html
	@rm npm-debug.log

.PHONY: test test-live test-unit test-integration test-unit-live test-integration-live test-coverage setup clean