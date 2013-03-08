#
# Makefile for roomies-prototype
#

REPORTER = dot
TEST_DIRECTORY = test/
TEST_CMD = NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) $(TEST_DIRECTORY)

test:
	@$(TEST_CMD)

testlive:
	@$(TEST_CMD) --growl --watch

.PHONY: test testlive

