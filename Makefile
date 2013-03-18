#
# Makefile for roomies-prototype
#

REPORTER = dot
COVERAGE_REPORTER = html-cov
TEST_CMD = NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) --require test/runner.js --globals config
COVERAGE_CMD = NODE_ENV=test ./node_modules/.bin/jscover src test-cov
TEST_LIVE_CMD = $(TEST_CMD) --growl --watch

test: test-unit test-integration

test-live: test-unit-live test-integration-live

test-unit:
	@$(TEST_CMD) test/unit/*

test-integration:
	@$(TEST_CMD) test/integration/*

test-unit-live:
	@$(TEST_LIVE_CMD) test/unit/*

test-integration-live:
	@$(TEST_LIVE_CMD) test/integration/*

test-coverage: test
	@$(COVERAGE_CMD)
	@COVERAGE=1 $(TEST_CMD) $(COVERAGE_REPORTER) test/unit/*  > unit-coverage.html
	@COVERAGE=1 $(TEST_CMD) $(COVERAGE_REPORTER) test/integration/* > integration-coverage.html

.PHONY: test testlive