
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	var spawn = require('child_process').spawn;

	// before running the app, compile scss
	spawn('make', ['precompile-sass']);
}

var app;
if(process.env.COVERAGE) {
	app = require('./test-cov/app.js');
} else {
	app = require('./src/app.js');
}

module.exports = app;
