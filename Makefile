#
# Makefile for roomies-prototype
#

SHELL = bash

REPORTER = spec
COVERAGE_REPORTER = html-cov
COVERALLS_REPORTER = mocha-lcov-reporter
TEST_CMD = NODE_ENV=test ./node_modules/.bin/mocha --require test/runner.js --globals config
COVERAGE_CMD = NODE_ENV=test ./node_modules/.bin/jscover src src-cov
COVERALLS_CMD = NODE_ENV=test ./node_modules/.bin/jscoverage src src-cov --exclude /\.\(hbs\|otf\|eot\|svg\|ttf\|woff\|png\|ico\|html\|css\|json\)/
TEST_LIVE_CMD = $(TEST_CMD) --growl --watch

SCSS_PATH = src/shared/sass/app.scss
CSS_PATH = src/public/stylesheets/app.css

# .dir will be matched with the TESTS Variable
TEST_FILES = community.dir home.dir resident.dir task.dir rank.dir
# .dir replaced by .test in order to use it in %.test
TESTS = $(TEST_FILES:.dir=.test)
LIVE_TESTS = $(TEST_FILES:.dir=.live-test)


test: $(TESTS)

# replace .test with /test.js from e.g. community.test (as argument [$@] to this function)
# in order to run the test
# this enables you to run `make test` as well as e.g. `make community.test`
%.test:
	@$(TEST_CMD) --reporter $(REPORTER) src/lib/$(subst .test,/test.js,$@)

%.live-test:
	@$(TEST_LIVE_CMD) --reporter $(REPORTER) src/lib/$(subst .live-test,/test.js,$@)

coveralls:
	@echo -n "Running jscoverage..."
	@$(COVERALLS_CMD)
	@echo "done"

coverage:
	@echo -n "Running jscover..."
	@$(COVERAGE_CMD)
	@echo "done"

test-coverage: test coverage
	@echo "Building Test Coverage Reports:"
	@echo -n "Creating unit coverage report..."
	@COVERAGE=1 $(TEST_CMD) --reporter $(COVERAGE_REPORTER) src/lib/*/test.js  > unit-coverage.html
	@echo "done"

test-coveralls: test coveralls
	@echo "Sending coverage to coveralls.io:"
	@COVERAGE=1 $(TEST_CMD) --reporter $(COVERALLS_REPORTER) src/lib/*/test.js | ./node_modules/coveralls/bin/coveralls.js

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

.PHONY: test test-unit test-unit-live test-coverage setup clean precompile-sass-live lint deps config docs
