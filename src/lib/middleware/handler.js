var express = require('express')
	, connectDomain = require('connect-domain')
	, path = require('path')
	, Exception401 = require(path.join('..', '..',
		'shared', 'exceptions', '401'));

function handler401(err, req, res, next) {
	if (err instanceof Exception401) {
		req.flash('error', res.__('Please login first.'));
		return res.redirect('/');
	}
	next();
}

module.exports = function(app) {
	app.use(handler401);
	app.use(express.errorHandler());
	app.use(connectDomain());
};
