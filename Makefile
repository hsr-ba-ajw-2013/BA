#
# Makefile for roomies-prototype
#

SHELL = bash

REPORTER = spec
COVERAGE_REPORTER = html-cov
COVERALLS_REPORTER = mocha-lcov-reporter
TEST_CMD = NODE_ENV=test ./node_modules/.bin/mocha --require test/runner.js --globals config
COVERALLS_CMD = NODE_ENV=test ./node_modules/.bin/jscoverage src src-cov --exclude /\.\(hbs\|otf\|eot\|svg\|ttf\|woff\|gif\|png\|ico\|html\|css\|json\)/
TEST_LIVE_CMD = $(TEST_CMD) --growl --watch

SCSS_BASE = src/server/sass
SCSS_PATH = $(SCSS_BASE)/app.scss
CSS_PATH = src/server/public/stylesheets/app.css

# .dir will be matched with the TESTS Variable
TEST_FILES = community.dir gamification.dir resident.dir task.dir ranking.dir policy.dir
# .dir replaced by .test in order to use it in %.test
TESTS = $(TEST_FILES:.dir=.test)
LIVE_TESTS = $(TEST_FILES:.dir=.live-test)

COMPONENT_DIR = src/server/api


test: $(TESTS)

# replace .test with /test.js from e.g. community.test (as argument [$@] to this function)
# in order to run the test
# this enables you to run `make test` as well as e.g. `make community.test`
%.test:
	@$(TEST_CMD) --reporter $(REPORTER) $(COMPONENT_DIR)/$(subst .test,/test.js,$@)

%.live-test:
	@$(TEST_LIVE_CMD) --reporter $(REPORTER) $(COMPONENT_DIR)/$(subst .live-test,/test.js,$@)

coveralls:
	@echo -n "Running jscoverage..."
	@$(COVERALLS_CMD)
	@echo "done"

parse-code-coverage:
	@echo "Parsing code coverage.."
	@$(foreach the_test, $(TESTS), $(shell COVERAGE=1 $(TEST_CMD) --reporter $(COVERALLS_REPORTER) $(COMPONENT_DIR)/$(subst .test,/test.js,$(the_test)) > coveralls_$(the_test).log))

test-coveralls: test coveralls parse-code-coverage
	@echo "Merging & sending them to coveralls.."
	@./node_modules/.bin/lcov-result-merger coveralls_\*.log | ./node_modules/coveralls/bin/coveralls.js
	@echo "Done"

setup: clean deps config precompile-sass precompile-templates
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
	@echo "Cleaning coverage"
	@-rm -Rf ./src-cov
	@echo "Cleaning npm debug log"
	@-rm npm-debug.log
	@echo "Cleaning docs"
	@-rm -fr ./docs
	@echo "Cleaning compiled CSS"
	@-rm $(CSS_PATH)

precompile-templates:
	@echo "Precompiling Templates"
	@node templatePrecompiler.js

precompile-sass:
	@echo "Precompiling SASS Stylesheets"
	@-rm $(CSS_PATH)
	@-sass --trace -t compressed --load-path $(SCSS_BASE)/vendor --load-path $(SCSS_BASE)/vendor/foundation --load-path $(SCSS_BASE)/vendor/bourbon $(SCSS_PATH) $(CSS_PATH)

precompile-sass-live:
	@nodemon -w $(SCSS_BASE) -e scss -x "make precompile-sass -f" Makefile

lint:
	@node_modules/.bin/jshint index.js src/

docs:
	-mkdir ./docs
	@NaturalDocs -i ./src -o HTML ./docs -p ./.naturaldocs -xi ./src/server/public -s Default style

.PHONY: test test-unit test-unit-live test-coveralls precompile-templates parse-code-coverage setup clean precompile-sass-live lint deps config docs
