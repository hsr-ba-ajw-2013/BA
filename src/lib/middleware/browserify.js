var browserify = require('browserify-middleware'),
	path = require('path');

module.exports = function browserifyInit(app, config) {
	app.use('/js'
		, browserify(path.join(config.srcDir, 'public', 'javascripts'))
	);
};