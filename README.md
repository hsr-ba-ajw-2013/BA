# BA

[![Build Status](https://travis-ci.org/hsr-ba-ajw-2013/BA.png?branch=master)](https://travis-ci.org/hsr-ba-ajw-2013/BA)
[![Coverage Status](https://coveralls.io/repos/hsr-ba-ajw-2013/BA/badge.png?branch=master)](https://coveralls.io/r/hsr-ba-ajw-2013/BA)

## Prerequisites
Node.js installed.

## Install
`./install.sh`

This script will automatically install all dependencies, create tables & run migrations if needed.

## Start
`npm start`

## Debug logging
In order to enable [debug](https://npmjs.org/package/debug) logging, start with
`DEBUG="roomies:*" npm start`. This will print all logging from roomies.
You can also enable debug logging of e.g. *barefoot* or *express.js* if you add it to
the debug string. In order to debug everything, set the DEBUG env variable to `*`.

## Testing
`npm test` or `make test`

## Documentation
Find the latest build of *Roomies*' code documentation online:
* http://hsr-ba-ajw-2013.github.io/BA/docs

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/971c206fb037a6539314d1471f01de06 "githalytics.com")](http://githalytics.com/hsr-ba-ajw-2013/BA)
