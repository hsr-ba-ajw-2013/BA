var express = require('express')
	, path = require('path')
	, Exception401 = require(path.join('..', '..',
		'shared', 'exceptions', '401'));

function handler401(err, req, res, next) {
	if (err instanceof Exception401) {
		if(req.is('json')) {
			return res.send(401);
		}
		return res.redirect('/login');
	}
	next(err);
}

module.exports = function handlerInit(app) {
	app.use(handler401);

	app.configure('development', function developmentEnvironment() {
		app.use(express.errorHandler());
	});
};
