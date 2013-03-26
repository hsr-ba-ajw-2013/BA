var express = require('express')
	, connectDomain = require('connect-domain')
	, path = require('path')
	, Exception401 = require(path.join('..', '..',
		'shared', 'exceptions', '401'));

function handler401(err, req, res, next) {
	if (err instanceof Exception401) {
		return res.status(401).render('../shared/views/401', {
			title: res.__('Login required')
		});
	}
	next();
}

module.exports = function(app) {
	app.use(connectDomain());
	app.use(handler401);
	app.use(express.errorHandler());
};
