#
# Makefile for roomies-prototype
#

REPORTER = dot
TEST_CMD = NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER)
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


.PHONY: test testlive