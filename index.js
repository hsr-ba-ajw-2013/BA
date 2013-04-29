
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	var spawn = require('child_process').spawn;

	// before running the app, compile scss and precompile our templates:
	spawn('make', ['precompile-sass']);
	spawn('make', ['precompile-templates']);
}

var app;
if(process.env.COVERAGE) {
	app = require('./src-cov/app.js');
} else {
	app = require('./src/app.js');
}

module.exports = app;
