// doesn't work yet.
/*if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	var spawn = require('child_process').spawn;

	// before running the app, compile scss
	spawn('make precompile-scss');
}*/

module.exports = process.env.COVERAGE
	? require('./test-cov/app.js')
	: require('./src/app.js');
