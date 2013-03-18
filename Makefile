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
	@$(TEST_CMD) --reporter $(REPORTER) test/unit/*

test-integration:
	@echo "Running Integration Tests:"
	@$(TEST_CMD) --reporter $(REPORTER) test/integration/*

test-unit-live:
	@$(TEST_LIVE_CMD) --reporter $(REPORTER) test/unit/*

test-integration-live:

	@$(TEST_LIVE_CMD) --reporter $(REPORTER) test/integration/*

test-coverage: test
	@echo "Building Test Coverage Reports:"
	@$(COVERAGE_CMD)
	@COVERAGE=1 $(TEST_CMD) --reporter $(COVERAGE_REPORTER) test/unit/*  > unit-coverage.html
	@COVERAGE=1 $(TEST_CMD) --reporter $(COVERAGE_REPORTER) test/integration/* > integration-coverage.html

.PHONY: test testlive