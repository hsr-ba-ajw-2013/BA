var express = require('express')
	, path = require('path')
	, Exception401 = require(path.join('..', '..',
		'shared', 'exceptions', '401'));

function handler401(err, req, res, next) {
	if (err instanceof Exception401) {
		return res.status(401).render('../shared/views/401', {
			title: res.__('Login required')
		});
	}
	next(err);
}

module.exports = function(app) {
	app.use(handler401);

	app.configure('development', function() {
		app.use(express.errorHandler());
	});
};
